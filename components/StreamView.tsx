'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUp, Play, Plus, Share2 } from 'lucide-react'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import Navbar from './Navbar'
import Image from 'next/image'

interface Song {
  id: string
  type: string
  url: string
  title: string
  smallImg: string
  bigImg: string
  extractedId: string
  active: true
  userId: string
  upvotes: number
  hasUpvoted: boolean
}

interface VideoPreview {
  title: string
  thumbnail: string
}

const regex = /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/

export default function StreamView({
    creatorId
}: {
    creatorId: string
}) {
    const [queue, setQueue] = useState<Song[]>([]);
    const [newSong, setNewSong] = useState("");
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [videoPreview, setVideoPreview] = useState<VideoPreview | null>(null);
    const [loading, setLoading] = useState(false);
    const session = useSession();

    const sortQueue = (queueToSort: Song[]) => {
      return [...queueToSort].sort((a, b) => b.upvotes < a.upvotes ? -1 : 1)
    }

    const refreshStreams = useCallback(async () => {
      try {
          const res = await axios.get(`/api/streams/?creatorId=${creatorId}`, {
              withCredentials: true
          });
          // console.log(res);
          setQueue(sortQueue(res.data.filteredStreams));
          setCurrentSong(res.data.activeStream.stream);
      } catch (error) {
          console.error("Error refreshing streams:", error);
      }
  }, [creatorId]);

    useEffect(() => {
      refreshStreams();
      const interval = setInterval(refreshStreams, 5000)
      return () => clearInterval(interval);
    }, [refreshStreams]);

    const addSong = async (e: React.FormEvent) => {
      e.preventDefault();
      try{
        setLoading(true);
        if(newSong.match(regex)){
          const res = await axios.post("/api/streams", {
            creatorId,
            url: newSong
          });
          setNewSong("");
          setVideoPreview(null);
          if(res.status === 200){
            setQueue(prevQueue => sortQueue([...prevQueue, res.data.stream]));
          }
        }
        else{
          alert("Invalid link");
        }
        setLoading(false);
      } catch(error){
        console.error("Error adding song to the list", error);
        setLoading(false);
      }
    }

    const toggleVote = async (id: string, isUpvote: boolean) => {
      try {
        await axios.post(`/api/streams/${isUpvote ? "upvote" : "downvote"}`, {
            streamId: id
        }, {
            withCredentials: true
        });
        await refreshStreams();
      } catch (error) {
        console.error("Error toggling vote:", error);
      }
    }

    const playNextSong = async () => {
      if (queue.length > 0) {
        await axios.get("/api/streams/nextStream", {
            withCredentials: true
        });
        refreshStreams();
      } else {
        setCurrentSong(null)
      }
    }

    const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setNewSong(value);
        try {
          if(value.match(regex)){
            const extractedId = value.split("?v=")[1];
            const res = await axios.post("/api/streams/preview", {
              videoId: extractedId
            });
            setVideoPreview(res.data);
          }
        } catch (error) {
          console.error("Error fetching video preview:", error);
          setVideoPreview(null);
        }
    }

    const handleShare = async () => {
      try {
        const shareUrl = `${window.location.hostname}/creator/${creatorId}`
        await navigator.clipboard.writeText(shareUrl);
        alert("Stream link copied to clipboard! Share this link with others to join your stream.");
      } catch (error) {
        console.error("Error sharing stream:", error);
        alert("Failed to generate share link. Please try again.");
      }
    }

    return (
        <div>
            <Navbar/>
            <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
                {/* <SigninSignout/> */}
                <div className="container mx-auto p-4 flex-grow">
                <h1 className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                  Muzer: Where creators and fans collaborate on the perfect playlist for every stream.
                </h1>
                
                {/* Current Song Video Player */}
                <Card className="mb-8 bg-gray-800/30 border-gray-700 backdrop-blur-sm">
                    <CardHeader>
                    <CardTitle className="text-2xl font-semibold text-purple-300">
                        Now Playing: {currentSong ? currentSong.title : 'No song selected'}
                    </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {currentSong ? (
                            <div className="aspect-video bg-gray-900/50 flex items-center justify-center rounded-lg border border-purple-500/30">
                                {/* <Music className="w-20 h-20 text-purple-400 animate-pulse" /> */}
                            
                                {creatorId === session.data?.user.id ? <iframe 
                                    width="1236" 
                                    height="695"
                                    src={`https://www.youtube.com/embed/${currentSong.extractedId}`} 
                                    title={currentSong.title} 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope;" >
                                </iframe> : <Image 
                                            src={currentSong.bigImg} 
                                            alt="Alternative Content Description" 
                                            style={{ width: '1236px', height: '695px', objectFit: 'cover' }} 
                                            />}
                            </div>
                        ) : (
                            <div className="aspect-video bg-gray-900/50 flex items-center justify-center rounded-lg border border-gray-700">
                              <p className="text-gray-400">No video available</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Add Song Form */}
                <Card className="mb-8 bg-gray-800/30 border-gray-700 backdrop-blur-sm">
                    <CardHeader>
                    <CardTitle className="text-xl font-semibold text-pink-300">Add a Song</CardTitle>
                    </CardHeader>
                    <CardContent>
                    <form onSubmit={addSong} className="flex flex-col gap-4">
                        <div className="flex gap-2">
                        <Input
                            type="text"
                            value={newSong}
                            onChange={handleInputChange}
                            placeholder="Enter YouTube URL"
                            className="flex-grow bg-gray-700/50 text-gray-100 placeholder-gray-400 border-gray-600 focus:border-pink-500 focus:ring-pink-500"
                        />
                        <Button disabled={loading} type="submit" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-200 ease-in-out">
                            {!loading ? <Plus className="w-5 h-5 mr-1" /> : ""}
                            {loading ? "Adding..." : "Add"}
                        </Button>
                        </div>
                        {videoPreview && (
                        <div className="mt-4 bg-gray-700/50 p-4 rounded-lg flex items-center gap-4">
                            <Image src={videoPreview.thumbnail} alt={videoPreview.title} layout="responsive" width={16} height={9} className="rounded"/>
                        </div>
                        )}
                    </form>
                    </CardContent>
                </Card>

                {/* Song Queue */}
                <Card className="mb-8 bg-gray-800/30 border-gray-700 backdrop-blur-sm overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold text-blue-300">Song Queue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative" style={{ height: `${queue.length * 80}px` }}>
                            {queue.length > 0 ? (
                            queue.map((song, index) => (
                                <div 
                                key={song.id} 
                                className="absolute w-full transition-all duration-500 ease-in-out"
                                style={{ top: `${index * 80}px` }}
                                >
                                <div className="flex items-center justify-between bg-gray-700/30 p-4 rounded-lg border border-gray-600 hover:border-blue-500/50 transition-colors duration-200">
                                    <span className="text-gray-100 font-medium">{song.title}</span>
                                    <div className="flex items-center gap-3">
                                    <span className="text-sm text-gray-300 bg-gray-600/50 px-2 py-1 rounded-full">
                                        {song.upvotes ? song.upvotes : 0} {song.upvotes === 1 ? 'vote' : 'votes'}
                                    </span>
                                    <Button
                                        size="sm"
                                        onClick={() => toggleVote(song.id, !song.hasUpvoted)}
                                        className={`transition-all duration-200 ease-in-out transform hover:scale-105 focus:ring-2 focus:ring-blue-400 focus:outline-none
                                        ${song.hasUpvoted 
                                            ? 'bg-blue-500 text-white hover:bg-blue-600' 
                                            : 'bg-gray-600 text-gray-300 hover:bg-gray-500'}`}
                                        aria-label={song.hasUpvoted ? "Remove vote" : "Upvote"}
                                    >
                                        <ArrowUp className={`w-5 h-5 ${song.hasUpvoted ? 'fill-current' : ''}`} />
                                    </Button>
                                    </div>
                                </div>
                                </div>
                            ))
                            ) : (
                            <p className="text-gray-400 text-center py-4"></p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Play Next Song Button */}
                <div className="mt-8 text-center flex justify-center gap-4">
                    {creatorId === session.data?.user.id && <Button 
                        onClick={playNextSong} 
                        disabled={queue.length === 0}
                        className="bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600 disabled:from-gray-700 disabled:to-gray-700 disabled:text-gray-500 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 ease-in-out transform hover:scale-105 focus:ring-2 focus:ring-green-400 focus:outline-none">
                        <Play className="w-6 h-6 mr-2" />
                        Play Next Song
                    </Button>}
                    <Button
                        onClick={handleShare}
                        // disabled={!currentSong}
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 disabled:from-gray-700 disabled:to-gray-700 disabled:text-gray-500 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 ease-in-out transform hover:scale-105 focus:ring-2 focus:ring-blue-400 focus:outline-none">
                        <Share2 className="w-6 h-6 mr-2" />
                        Share Stream
                    </Button>
                </div>
                </div>
            </div>
        </div>
    )
}