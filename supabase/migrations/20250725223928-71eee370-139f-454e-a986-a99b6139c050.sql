
-- Add foreign key constraint between posts.author_id and profiles.user_id
ALTER TABLE public.posts 
ADD CONSTRAINT posts_author_id_fkey 
FOREIGN KEY (author_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Also add foreign key constraint for articles table if it doesn't exist
ALTER TABLE public.articles 
ADD CONSTRAINT articles_author_id_fkey 
FOREIGN KEY (author_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;
