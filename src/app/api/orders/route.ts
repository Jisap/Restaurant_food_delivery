import { getAuthSession } from "@/utils/auth";
import { prisma } from "@/utils/connect";
import { NextResponse, NextRequest } from 'next/server';



// Fetch all orders
export const GET = async (req: NextResponse) => {

    const  session  = await getAuthSession(); // Se usa desde el lado del "server"

    if(session){
    
        try {
    
            if (session.user.isAdmin) {                                             // Si el user es admin
                const orders = await prisma.order.findMany();                       // obtenemos todas las orders    
                return new NextResponse(JSON.stringify(orders), { status: 200 });
            }
            const orders = await prisma.order.findMany({                            // Sino obtenemos las order
                where: {                                                            // según su email
                    userEmail: session.user.email!,
                },
            });
            return new NextResponse(JSON.stringify(orders), { status: 200 });
    
        } catch (error) {
            console.log(error)
            return new NextResponse(JSON.stringify({ message: "Something went wrong!" }),
                { status: 500 }
            );
        }

    } else {
        return new NextResponse(
            JSON.stringify({ message: "You are not authenticated!" }),
            { status: 401 }
        );
    }
}

//Create order
export const POST = async(req: NextRequest) => {
    const session = await getAuthSession(); // Se usa desde el lado del "server"

    if (session) {

        try {

            const body = await req.json();

            if (session.user) {                                                     // Si el user esta logueado
                const order = await prisma.order.create({                           // Obtenemos los datos de lo que se quiere comprar    
                    data: body                                                      // desde el body de la petición
                });                       
                return new NextResponse(JSON.stringify(order), { status: 200 });    // Devolvemos la order
            }
            

        } catch (error) {
            console.log(error)
            return new NextResponse(JSON.stringify({ message: "Something went wrong!" }),
                { status: 500 }
            );
        }

    } else {
        return new NextResponse(
            JSON.stringify({ message: "You are not authenticated!" }),
            { status: 401 }
        );
    }  
}