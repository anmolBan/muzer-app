// import { PrismaClient } from "@prisma/client/extension";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import {z} from "zod"

const UpvoteSchema = z.object({
    streamId: z.string(),

});

export async function POST(req: NextRequest){
    const session = await getServerSession(authOptions);

    if(!session?.user.id){
        return NextResponse.json({
            message: "Unauthenticated"
        }, {
            status: 403
        });
    }
    try{
        const reqBody = await req.json();
        const data = UpvoteSchema.parse(reqBody);

        const userId = (session.user.id).toString();
        await prisma.upvote.delete({
            where: {
                userId_streamId: {
                    userId: userId,
                    streamId: data.streamId
                }
            }
        });
        return NextResponse.json({
            message: "Downvote Successful",
        }, {
            status: 200
        });
    } catch(error){
        return NextResponse.json({
            message: "Error while upvoting",
            error
        }, {
            status: 403
        });
    }
}