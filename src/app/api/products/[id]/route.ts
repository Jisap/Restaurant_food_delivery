import { prisma } from '@/utils/connect';
import { NextRequest, NextResponse } from 'next/server';


// Get Single Product
export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => { // Se reciben el id del item

    const { id } = params; //id

    try {
 
        const product = await prisma.product.findUnique({    // Buscamos en bd la order: ;
            where: {
                id: id                       // según id del item 
            },
        });

        return new NextResponse(
            JSON.stringify( product ),
            { status: 200 }
        )

    } catch (error) {
        console.log(error)
        return new NextResponse(
            JSON.stringify({ message: "Something went wrong!" }),
            { status: 500 }
        )
    }
}