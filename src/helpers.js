export const setupShadow = (element, html, css) => {
  const shadow = element.attachShadow({ mode: "open" });
	const template = document.createElement("template");
	// applies global styles, local styles and html
  template.innerHTML = '<style>@import "styles.css";' + css + "</style>" + html;
  const templateContent = template.content;
	shadow.appendChild(templateContent.cloneNode(true));
	return shadow;
};
