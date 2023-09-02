import { prisma } from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";



export const PUT = async(req:NextRequest, {params}:{params:{intentId:string}}) => {

    //const { intentId } = params;

    const { pathname } = req.nextUrl;
    const intentId = pathname.split('/').pop();
    console.log('intentId',intentId)
    
    try {
        
        await prisma.order.update({
            where: {
                intent_id: intentId
            },
            data: { status: "Being prepared!"},
        });

        return new NextResponse(
            JSON.stringify({ message: "Order has been updated" }),
            { status: 200 }    
        )

    } catch (error) {
        console.log(error);
        return new NextResponse(
            JSON.stringify({ message: "Something went wrong" }),
            { status: 500 }
        )
    }
}