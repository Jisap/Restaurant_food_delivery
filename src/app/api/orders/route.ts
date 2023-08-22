import { getAuthSession } from "@/utils/auth";
import { prisma } from "@/utils/connect";
import { NextResponse } from "next/server"



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