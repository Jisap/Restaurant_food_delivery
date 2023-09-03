

import { prisma } from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server"



// Fetch all products
export const GET = async (req: NextRequest) => {

    const { searchParams } = new URL(req.url); // Obtengo los params de la url de la petición
    
    const cat = searchParams.get("cat");       // api/products?cat="pizzas" -> obtengo el param cat

    try {

        const products = await prisma.product.findMany({ // Buscaremos dentro de la bd los productos
            where: {                                                // donde    
                ...(cat ? { catSlug: cat } : { isFeatured: true })  // si existe la cat catSlug=cat y sino donde featured=true
            }
        })
        return new NextResponse(JSON.stringify(products),
            { status: 200 });

    } catch (error) {
        console.log(error)
        return new NextResponse(JSON.stringify({ message: "Something went wrong!" }),
            { status: 500 });
    };

}

// Create product
export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const product = await prisma.product.create({
            data: body,
        });
        return new NextResponse(JSON.stringify(product), { status: 201 });
    } catch (err) {
        console.log(err);
        return new NextResponse(
            JSON.stringify({ message: "Something went wrong!" }),
            { status: 500 }
        );
    }
};