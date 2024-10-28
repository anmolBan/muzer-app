import prisma from "@/app/lib/db";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import zod from "zod";


const YT_REGEX = /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/;

const CreateStreamSchema = zod.object({
    creatorId: zod.string(),
    // TODO: restrict it to only youtube and spotify
    url: zod.string()
});

export async function POST(req: NextRequest){
    try{
        const reqBody = await req.json();
        const data = CreateStreamSchema.parse(reqBody);
        const isYt = data.url.match(YT_REGEX);
        if(!isYt){
            return NextResponse.json({
                message: "Invalid url"
            }, {
                status: 411
            });

        }
        const extractedId = data.url.split("?v=")[1];
        const getStreamData = await axios(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${extractedId}&key=${process.env.YOUTUBE_API_KEY}`);
        const title = getStreamData.data.items[0].snippet.title;
        const smallImg = getStreamData.data.items[0].snippet.thumbnails.default.url;
        const bigImg = getStreamData.data.items[0].snippet.thumbnails.maxres.url;
        const stream = await prisma.stream.create({
            data: {
                userId: data.creatorId,
                url: data.url,
                extractedId,
                type: "Youtube",
                title,
                smallImg,
                bigImg
            }
        });
        return NextResponse.json({
            message: "Added stream",
            id: stream.id
        }, {
            status: 200
        });
    } catch(e){
        console.error(e)
        return NextResponse.json({
            message: "Error while adding a stream"
        }, {
            status: 411
        });
    }
}

export async function GET(req: NextRequest){
    const creatorId = req.nextUrl.searchParams.get("creatorId");
    const streams = await prisma.stream.findMany({
        where: {
            userId: creatorId ?? ""
        }
    });

    return NextResponse.json({
        streams
    })
}