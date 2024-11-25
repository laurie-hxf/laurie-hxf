update(){
	cd /Users/laurie/Documents/aboutme/jasonlong_laurie
	npm install clone-response
	node build-svg.js
	git add .
	git commit -m"update" 
	git push origin main
}
