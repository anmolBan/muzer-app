import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    console.log(req);
    const session = await getServerSession(authOptions);

    if(!session?.user){
        return NextResponse.json({
            message: "Unauthenticated"
        }, {
            status: 403
        });
    }

    const streams = await prisma.stream.findMany({
        where: {
            userId: session.user.id as string
        },
        include: {
            _count: {
                select: {
                    upvotes: true
                }
            },
            upvotes: {
                where: {
                    userId: session.user.id as string
                }
            }
        }
    });

    return NextResponse.json({
        streams: streams.map(({_count, ...rest}) => ({
            ...rest,
            upvotes: _count.upvotes,
            hasUpvoted: rest.upvotes.length ? true: false
        }))
    });
}