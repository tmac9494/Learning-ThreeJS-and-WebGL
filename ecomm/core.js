// tracks state of application
let sceneState = {
	centerRequest: true,
	swatchChange: {
		new: false,
		texture: null,
	},
	modelIndex:0, 
	textures: {},
}

// controls defaults 
const sceneSettings = {
	modelScale: 1,
	maps: ["map", "bumpMap", "normalMap", "roughnessMap"],
}

// object containing all the information about our models
const modelData = [
	// 
	{
		name: "Bower Love Seat",
		type: "Love Seat",
		path: "../assets/models/love-seat",
		modelFile: "/t-low-poly.obj",
		targets: {
			main: {
				static: false,
				objects: ["Shape048", "Sofa_2", "Sofa2_pillows001"],
			},
			legs: { 
				static: true,
				objects: ["ChamferCyl002"],
			}
		},
		objectSettings: {
			"*": {
				castShadow: true,
			},
			"ChamferCyl002": {
				receiveShadow: true,
			},
			"Sofa_2": {
				receiveShadow: true,
			},
			"Sofa2_pillows001": {
				receiveShadow: true,
			},
			"Shape048": {
				receiveShadow: true,
			}
		},
		textures: {
			default: "cream",
			cream: { // <-------- can hold map(texure image), bumpmap, roughnessMap, normalMap
				// relative to path decalred above
				title: "Homespun Cream",
				selectable: true,
				map: "/texture/Homespun_Cream_dif.jpg",
				bumpMap: "/texture/Homespun_Cream_bump.jpg",
				normalMap: "/texture/Homespun_Cream_normal.jpg",
				styles: {
					bumpScale: 1.3,
					roughness: 1,
				},
				wrapS: 1,
				wrapT: 1,
				target: "main", // <-------------- either holds a defined "target" array of object names or targets the object by name directly if string is not predifined as a target group
			},
			solstice: {
				title: "Solstice",
				selectable: true,
				map: "/texture/Palette_Solstice_d.jpg",
				bumpMap: "/texture/Palette_Solstice_b.jpg",
				normalMap: "/texture/Palette_Solstice_n.jpg",
				styles: {
					bumpScale: 1.3,
					roughness: 1,
				},
				wrapS: 1,
				wrapT: 1,
				target: "main",
			},
			graphite: {
				title: "Graphite",
				selectable: true,
				map: "/texture/Palette_Graphite_d.jpg",
				bumpMap: "/texture/Palette_Graphite_b.jpg",
				normalMap: "/texture/Palette_Graphite_n.jpg",
				styles: {
					bumpScale: 1.3,
					roughness: 1,
				},
				wrapS: 1,
				wrapT: 1,
				target: "main",
			},
			sterling: {
				title: "Sterling",
				selectable: true,
				map: "/texture/Homespun_Sterling_dif.jpg",
				bumpMap: "/texture/Homespun_Sterling_bump.jpg",
				normalMap: "/texture/Homespun_Sterling_normal.jpg",
				styles: {
					bumpScale: 1.3,
					roughness: 1,
				},
				wrapS: 1,
				wrapT: 1,
				target: "main",
			},
			pressman: {
				title: "Pressman Parchment",
				selectable: true,
				map: "/texture/Pressman_Parchment_d.jpg",
				bumpMap: "/texture/Pressman_Parchment_b.jpg",
				normalMap: "/texture/Pressman_Parchment_n.jpg",
				styles: {
					bumpScale: 1.3,
					roughness: 1,
				},
				wrapS: 1,
				wrapT: 1,
				target: "main",
			},
			wood: {
				title: "Leg Wood",
				selectable: false,
				map: "/texture/ArchiCGI_wood_wallnut_diff.jpg",
				bumpMap: "/texture/ArchiCGI_wood_wallnut_bump.jpg",
				roughnessMap: "/texture/ArchiCGI_wood_wallnut_refl.jpg",
				styles: {
					roughness: 1,
					clearCoat: .2,
					bumpScale: .02,
				},
				wrapS: 1,
				WrapT: 1,
				target: "legs",
			}
		},
	},
	{
		name: "Bower Couch",
		type: "Couch",
		path: "../assets/models/couch",
		modelFile: "/trent-low-poly.obj",
		targets: {
			main: {
				static: false,
				objects: ["Stich", "Sofa_3", "Pillows"],
			},
			legs: { 
				static: true,
				objects: ["Legs"],
			}
		},
		objectSettings: {
			"*": {
				castShadow: true,
			},
			"Legs": {
				receiveShadow: true,
			},
			"Sofa_3": {
				receiveShadow: true,
			},
			"Pillows": {
				receiveShadow: true,
			},
			"Stich": {
				receiveShadow: true,
			}
		},
		textures: {
			default: "cream",
			cream: { // <-------- can hold map(texure image), bumpmap, roughnessMap, normalMap
				// relative to path decalred above
				title: "Homespun Cream",
				selectable: true,
				map: "/texture/Homespun_Cream_dif.jpg",
				bumpMap: "/texture/Homespun_Cream_bump.jpg",
				normalMap: "/texture/Homespun_Cream_normal.jpg",
				styles: {
					bumpScale: 1.3,
					roughness: 1,
				},
				wrapS: 1,
				wrapT: 1,
				target: "main", // <-------------- either holds a defined "target" array of object names or targets the object by name directly if string is not predifined as a target group
			},
			solstice: {
				title: "Solstice",
				selectable: true,
				map: "/texture/Palette_Solstice_d.jpg",
				bumpMap: "/texture/Palette_Solstice_b.jpg",
				normalMap: "/texture/Palette_Solstice_n.jpg",
				styles: {
					bumpScale: 1.3,
					roughness: 1,
				},
				wrapS: 1,
				wrapT: 1,
				target: "main",
			},
			graphite: {
				title: "Graphite",
				selectable: true,
				map: "/texture/Palette_Graphite_d.jpg",
				bumpMap: "/texture/Palette_Graphite_b.jpg",
				normalMap: "/texture/Palette_Graphite_n.jpg",
				styles: {
					bumpScale: 1.3,
					roughness: 1,
				},
				wrapS: 1,
				wrapT: 1,
				target: "main",
			},
			sterling: {
				title: "Sterling",
				selectable: true,
				map: "/texture/Homespun_Sterling_dif.jpg",
				bumpMap: "/texture/Homespun_Sterling_bump.jpg",
				normalMap: "/texture/Homespun_Sterling_normal.jpg",
				styles: {
					bumpScale: 1.3,
					roughness: 1,
				},
				wrapS: 1,
				wrapT: 1,
				target: "main",
			},
			pressman: {
				title: "Pressman Parchment",
				selectable: true,
				map: "/texture/Pressman_Parchment_d.jpg",
				bumpMap: "/texture/Pressman_Parchment_b.jpg",
				normalMap: "/texture/Pressman_Parchment_n.jpg",
				styles: {
					bumpScale: 1.3,
					roughness: 1,
				},
				wrapS: 1,
				wrapT: 1,
				target: "main",
			},
			wood: {
				title: "Leg Wood",
				selectable: false,
				map: "/texture/ArchiCGI_wood_wallnut_diff.jpg",
				bumpMap: "/texture/ArchiCGI_wood_wallnut_bump.jpg",
				roughnessMap: "/texture/ArchiCGI_wood_wallnut_refl.jpg",
				styles: {
					roughness: 1,
					clearCoat: .2,
					bumpScale: .02,
				},
				wrapS: 1,
				WrapT: 1,
				target: "legs",
			}
		}
	},
]