import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(){
    const session = await getServerSession(authOptions);

    if(!session?.user){
        return NextResponse.json({
            message: "Unauthorized"
        }, {
            status: 403
        });
    }

    const userId = session.user.id;

    const mostUpvotedStream = await prisma.stream.findFirst({
        where: {
            AND: [
                {userId: userId as string},
                {active: true}
            ]
        },
        orderBy: {
            upvotes: {
                _count: 'desc'
            }
        }
    });

    // console.log(mostUpvotedStream);

    await Promise.all([prisma.currentStream.upsert({
        where: {
            userId: mostUpvotedStream?.userId as string
        }, 
        update: {
            streamId: mostUpvotedStream?.id
        },
        create: {
            userId: mostUpvotedStream?.userId as string,
            streamId: mostUpvotedStream?.id || "anmol"
        }
    }), prisma.stream.update({
        where: {
            id: mostUpvotedStream?.id ?? ""
        },
        data: {
            active: false
        }
    })]);

    return NextResponse.json({
        stream: mostUpvotedStream
    });
}