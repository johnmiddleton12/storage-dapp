echo Word Count: $(git ls-files | grep -wv json | grep .js | xargs cat | wc -l)
