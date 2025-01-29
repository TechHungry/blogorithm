import fs from "fs";
import path from "path";
import matter from "gray-matter";

type Team = {
    name: string;
    role: string;
    avatar: string;
    linkedIn: string;
};

type Metadata = {
    title: string;
    publishedAt: string;
    summary: string;
    image?: string;
    images: string[];
    tag?: string;
    team: Team[];
    link?: string;
};

export function blog_slug(title) {
	return title.replace(/\s+/g, '-').toLowerCase();
}

export function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();

    return `${month} ${day}, ${year}`;
}

function getMDXFiles(dir) {
    if (!fs.existsSync(dir)) {
        throw new Error(`Directory not found: ${dir}`);
    }

    return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

function readMDXFile(filePath) {
    if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
    }

    const rawContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(rawContent);

    const metadata = {
        title: data.title || "",
        publishedAt: data.publishedAt,
        summary: data.summary || "",
        image: data.image || "",
        images: data.images || [],
        status: data.status || "",
        tag: data.tag || [],
        team: data.team || [],
        link: data.link || "",
    };

    return { metadata, content };
}

function getMDXData(dir) {
    const mdxFiles = getMDXFiles(dir);
    return mdxFiles.map((file) => {
        const { metadata, content } = readMDXFile(path.join(dir, file));
        const slug = path.basename(file, path.extname(file));

        return {
            metadata,
            slug,
            content,
        };
    });
}

export function getPosts(customPath = ["", "", "", ""]) {
    const postsDir = path.join(process.cwd(), ...customPath);
    console.log(postsDir);
    return getMDXData(postsDir);
}
