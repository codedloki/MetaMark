import React from 'react'
import { GridBackground } from './CustomBack'
export  default function Error404(){
	return(
	<GridBackground className="h-screen overflow-y-scroll md:overflow-hidden">
	<div className="text-3xl text-white">
	  <p className="text-5xl">Error 404</p>
	  <p>Page Not Found</p>
	</div>
</GridBackground>
	)
}