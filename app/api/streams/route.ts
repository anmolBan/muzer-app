import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/db";
import { YT_REGEX } from "@/lib/ytRegex";
import axios from "axios";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import zod from "zod";

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
        let extractedId = data.url.split("?v=")[1];
        if(extractedId.length > 11){
            extractedId = extractedId.split("&")[0];
        }
        const getStreamData = await axios(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${extractedId}&key=${process.env.YOUTUBE_API_KEY}`);
        const title = getStreamData.data.items[0].snippet.title;
        const smallImg = getStreamData.data.items[0].snippet.thumbnails.default.url;
        const bigImg = getStreamData.data.items[0].snippet.thumbnails.maxres.url;
        const stream = await prisma.stream.create({
            data: {
                userId: (data.creatorId).toString(),
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
            id: stream.id,
            stream
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
    const session = await getServerSession(authOptions);

    if(!session?.user){
        return NextResponse.json({
            message: "Unauthenticated"
        }, {
            status: 403
        });
    }
    if(!creatorId){
        return NextResponse.json({
            message: "Error getting details"
        }, {
            status: 411
        });
    }
    const [streams, activeStream] = [await prisma.stream.findMany({
        where: {
            userId: creatorId
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
    }), await prisma.currentStream.findFirst({
        where: {
            userId: creatorId
        }, 
        include: {
            stream: true
        }
    })];

    const filteredStreams = streams.filter((stream) => stream.active === true)

    return NextResponse.json({
        filteredStreams: filteredStreams.map(({_count, ...rest}) => ({
            ...rest,
            upvotes: _count.upvotes,
            hasUpvoted: rest.upvotes.length ? true: false
        })),
        activeStream
    })
}