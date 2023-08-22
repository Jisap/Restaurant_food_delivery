import { prisma } from '@/utils/connect';
import { NextRequest, NextResponse } from 'next/server';



export const PUT = async ( req:NextRequest, { params }:{ params:{ id:string }}) => { // Se reciben el value del input y el id del item
    
    const { id } = params; //id
    
    try {

        const body = await req.json(); // value

        await prisma.order.update({    // Actualizamos en bd la order
            where: {                    
                id:id                  // según id del item 
            },
            data: { status: body }     // con el nuevo valor 
        });

        return new NextResponse(
            JSON.stringify({ message: "Order has been updated!"}),
            { status: 200 }    
        )
        
    } catch (error) {
        console.log(error)
        return new NextResponse(
            JSON.stringify({message: "Something went wrong!"}),
            { status:500}
        )
    }
}