update(){
	cd /Users/laurie/Documents/aboutme/jasonlong_laurie
	node build-svg.js
	git add .
	git commit -m"update" 
	git push origin main
}
