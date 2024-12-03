"use server"
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import {z} from "zod"

const UpvoteSchema = z.object({
    streamId: z.string()
});

export async function POST(req: NextRequest){
    const session = await getServerSession(authOptions);

    if(!session?.user.id){
        return NextResponse.json({
            message: "Unathenticated"
        }, {
            status: 403
        });
    }
    try{
        const reqBody = await req.json();
        console.log(reqBody);
        const data = UpvoteSchema.parse(reqBody);

        const userId = (session.user.id).toString();
        console.log(userId);
        await prisma.upvote.create({
            data: {
                userId: userId,
                streamId: data.streamId
            }
        });
        return NextResponse.json({
            message: "Upvote Successful",
        }, {
            status: 200
        });
    } catch(error){
        console.error(error);
        return NextResponse.json({
            message: "Error while upvoting"
        }, {
            status: 403
        });
    }
}