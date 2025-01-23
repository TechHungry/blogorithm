const blog = {
    label: "Blog",
    title: "Writing about design and tech...",
    description: `Read what ${person.name} has been up to recently`,
    // Create new blog posts by adding a new .mdx file to app/blog/posts
    // All posts will be listed on the /blog route
};

const work = {
    label: "Work",
    title: "My projects",
    description: `Design and dev projects by ${person.name}`,
    // Create new project pages by adding a new .mdx file to app/blog/posts
    // All projects will be listed on the /home and /work routes
};

export { blog, work };
