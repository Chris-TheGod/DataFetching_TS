import { ReactNode, useEffect, useState } from 'react';
import BlogPosts, { BlogPost } from './components/BlogPosts';
import { get } from './util/http';
import fetchingImg from './assets/data-fetching.png';
import ErrorMessage from './components/ErrorMessage';

export type RawDataBlogPost = {
  id: number;
  userId: number;
  title: string;
  body: string;
};

function App() {
  const [fetchedPosts, setFetchedPosts] = useState<BlogPost[]>();
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchPosts = async () => {
      setIsFetching(true);
      try {
        const data = await get('https://jsonplaceholder.typicode.com/posts');
        const blogPosts: BlogPost[] = data.map((rawPost) => {
          return {
            id: rawPost.id,
            title: rawPost.title,
            text: rawPost.body,
          };
        });
        setFetchedPosts(blogPosts);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
      }

      setIsFetching(false);
    };

    fetchPosts();
  }, []);

  let content: ReactNode;

  if (error) {
    content = <ErrorMessage text={error} />;
  }

  if (fetchedPosts) {
    content = <BlogPosts posts={fetchedPosts} />;
  }

  if (isFetching) {
    content = <p className='lodaing-fallback'>Fetching posts...</p>;
  }

  return (
    <main>
      <img src={fetchingImg} />
      {content}
    </main>
  );
}

export default App;
