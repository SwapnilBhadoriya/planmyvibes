import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";

export interface RelatedPost {
    title: string;
    readTime: string;
    image: string;
    href?: string;
}

interface Props {
    posts: RelatedPost[];
    title?: string;
}

export default function RelatedPosts({ posts, title = "Related Posts" }: Props) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-bold text-gray-900 text-base mb-4">{title}</h3>
            <div className="flex flex-col gap-4">
                {posts.map((post, i) => (
                    <Link key={i} href={post.href ?? "#"} className="flex gap-3 group cursor-pointer">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                            <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-200" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 group-hover:text-purple-600 transition-colors">
                                {post.title}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">{post.readTime}</p>
                        </div>
                    </Link>
                ))}
            </div>
            <Link href="/blog" className="flex items-center gap-1 text-sm font-semibold text-purple-600 mt-4 hover:text-purple-700">
                View all posts <HugeiconsIcon icon={ArrowRight01Icon} size={13} strokeWidth={2.5} />
            </Link>
        </div>
    );
}
