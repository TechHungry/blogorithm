import Avatar from "./avatar";
import CoverImage from "./cover-image";
import DateFormatter from "./date-formatter";
import {PostTitle} from "@/components/post-title";
import imageUrlBuilder from "@sanity/image-url";
import {SanityDocument} from "next-sanity";
import {client} from "@/sanity/client";

type Props = {
    title: string;
    coverImage: string;
    date: string;
    authors: any[];
};


export async function PostHeader({title, coverImage, date, authors}: Props) {
    const {projectId, dataset} = client.config();
    if (!projectId || !dataset) {
        throw new Error("Sanity client configuration is missing projectId or dataset");
    }
    return (
        <>
            <PostTitle>{title}</PostTitle>
            <div className="mb-4 flex flex-row justify-between items-center">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {authors.map((author: SanityDocument) => (
                        <div className={`flex flex-row items-center`} key={author._id}>
                            <Avatar name={author.name}
                                    picture={imageUrlBuilder({projectId, dataset}).image(author.profileImage).url()}
                                    date={date}/>
                        </div>
                    ))}
                </div>
            </div>
            <div className="my-8 aspect-w-16 aspect-h-9 flex justify-center">
                <CoverImage title={title} src={coverImage}/>
            </div>
            <hr className={`bg-gray-500`}/>

        </>
    );
}
