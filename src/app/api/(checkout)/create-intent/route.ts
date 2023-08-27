import { prisma } from "@/utils/connect";
import { NextResponse } from "next/server";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


export const POST = async ({ params }:{ params:{ id:string }}) => {
    const { id } = params;

    const order = await prisma.order.findUnique({   // Buscamos la order en bd
        where: {
            id: id,
        },
    });

    if(order){  // Si existe

        const paymentIntent = await stripe.paymentIntents.create({ // Creamos la intención de pago
            amount: 100 * 100,
            currency: "eur",
            automatic_payment_methods: {
                enabled: true,
            },
        });

        await prisma.order.update({ // Actualizamos la prop intent_id con la id de la intención de pago
            where:{
                id: id
            },
            data: { intent_id: paymentIntent.id }
        })

        return new NextResponse(JSON.stringify({ clientSecret: paymentIntent.client_Secret }), { // Devolvemos un clientSecret de la intención de pago
            status: 200,
        });
    
    }else{
        return new NextResponse(JSON.stringify({ message:"Order not found" }),{
            status: 404,
        });
    }
};