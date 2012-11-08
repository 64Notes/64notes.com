# Save as Rakefile, and run `rake watch`

def recompile(base, relative)
  haml = File.join(base, relative)
  html = File.join(base, relative.gsub(/\.haml$/, '.html'))
  print ">>> Change detected to #{relative} >> "
  system "haml", haml, html
  puts "Compiled <<<"
end
desc "Watch HAML files for changes"
task :watch do
  require 'fssm'
  puts ">>> Watching for changes <<<"
  FSSM.monitor(Dir.pwd, '**/*.haml') do
    update &method(:recompile)
    create &method(:recompile)
  end
end
