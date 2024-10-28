// import { PrismaClient } from "@prisma/client/extension";
import prisma from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import {z} from "zod"

const UpvoteSchema = z.object({
    streamId: z.string()
});

export async function POST(req: NextRequest){
    const session = await getServerSession();

    if(!session?.user.id){
        return NextResponse.json({
            message: "Unathenticated"
        }, {
            status: 403
        });
    }
    try{
        const reqBody = await req.json();
        const data = UpvoteSchema.parse(reqBody);

        const userId = (session.user.id).toString();
        await prisma.upvote.create({
            data: {
                userId: userId,
                streamId: data.streamId
            }
        });
        return NextResponse.json({
            message: "Upvote Successful"
        }, {
            status: 200
        });
    } catch(error){
        return NextResponse.json({
            message: "Error while upvoting"
        }, {
            status: 403
        });
    }
}