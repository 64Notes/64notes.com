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

  module PostWithKeyValue
    def post_with_key_value(posts, post_key, value)
      selected = []
      for post in posts
        if post.data.has_key? post_key
          if post.data.fetch(post_key) == value
            selected.push(post)
          end
        end
      end
      selected
    end
  end
end
 
Liquid::Template.register_filter(Jekyll::ExcludePostCategory)
Liquid::Template.register_filter(Jekyll::PostWithKeyValue)
