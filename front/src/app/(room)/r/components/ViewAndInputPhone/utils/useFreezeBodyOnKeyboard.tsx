"use client";

import { useEffect } from "react";

/**
 * 
 *  Hook deprecated
 * 
 */

export function useFreezeBodyOnKeyboard(
	isKeyboardOpen: boolean,
	visibleHeight: number,
) {
	useEffect(() => {
		const html = document.documentElement;
		const body = document.body;

		if (isKeyboardOpen) {
			html.style.overflow = "hidden";
			body.style.overflow = "hidden";
			html.style.position = "fixed";
			html.style.width = "100%";
			html.style.height = `${visibleHeight}px`;
			body.style.position = "fixed";
			body.style.width = "100%";
			body.style.height = `${visibleHeight}px`;
		} else {
			html.style.overflow = "";
			body.style.overflow = "";
			html.style.position = "";
			html.style.width = "";
			html.style.height = "";
			body.style.position = "";
			body.style.width = "";
			body.style.height = "";
		}
		return () => {
			html.style.overflow = "";
			body.style.overflow = "";
			html.style.position = "";
			html.style.width = "";
			html.style.height = "";
			body.style.position = "";
			body.style.width = "";
			body.style.height = "";
		};
	}, [isKeyboardOpen, visibleHeight]);
}
