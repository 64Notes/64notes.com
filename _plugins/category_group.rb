module Jekyll
  module ExcludePostCategory 
    def exclude_post_category(posts, category)
      filtered = []
      for post in posts
        unless (post.categories.include?(category))
          filtered.push(post)
        end
      end
      filtered
    end
  end
end
 
Liquid::Template.register_filter(Jekyll::ExcludePostCategory)
