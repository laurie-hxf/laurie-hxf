update(){
	node build-svg.js
	git add .
	git commit -m"update" 
	git push origin main
}
