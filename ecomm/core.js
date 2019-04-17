// tracks state of application
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
		icon: "/display.jpg",
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
					roughness: 2,
					clearCoat: .1,
					bumpScale: .02,
				},
				wrapS: 1,
				WrapT: 1,
				target: "legs",
			}
		},
	},

	// ------- couch
	{
		name: "Bower Couch",
		type: "Couch",
		path: "../assets/models/couch",
		modelFile: "/trent-low-poly.obj",
		icon: "/display.jpg",
		targets: {
			main: {
				static: false,
				objects: ["Stich002", "Sofa_005", "Pillows002"],
			},
			legs: { 
				static: true,
				objects: ["Legs002"],
			}
		},
		objectSettings: {
			"*": {
				castShadow: true,
			},
			"Legs002": {
				receiveShadow: true,
			},
			"Sofa_005": {
				receiveShadow: true,
			},
			"Pillows002": {
				receiveShadow: true,
			},
			"Stich002": {
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
					roughness: 1.2,
					clearCoat: .05,
					bumpScale: .02,
				},
				wrapS: 1,
				WrapT: 1,
				target: "legs",
			}
		}
	},

	// ------- bower chair
	{
		name: "Bower Chair",
		type: "Chair",
		path: "../assets/models/bower-chair",
		modelFile: "/low-poly.obj",
		icon: "/display.jpg",
		targets: {
			main: {
				static: false,
				objects: ["Pillow_Chair001", "Chair001", "Chair002", "Seat002", "Seat1", "Shape041", "Shape047"],
			},
			legs: { 
				static: true,
				objects: ["ChamferCyl001"],
			}
		},
		objectSettings: {
			"*": {
				castShadow: true,
			},
			"Chair001": {
				receiveShadow: true,
			},
			"Chair002": {
				receiveShadow: true,
			},
			"Seat002": {
				receiveShadow: true,
			},
			"Seat1": {
				receiveShadow: true,
			},
			"Shape041": {
				receiveShadow: true,
			},
			"Shape047": {
				receiveShadow: true,
			},
			"Pillow_Chair001": {
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
					roughness: 1.2,
					clearCoat: .05,
					bumpScale: .02,
				},
				wrapS: 1,
				WrapT: 1,
				target: "legs",
			}
		}
	},

	// ------- bower ottoman
	{
		name: "Bower Ottoman",
		type: "Ottoman",
		path: "../assets/models/bower-ottoman",
		modelFile: "/low-poly.obj",
		icon: "/display.jpg",
		targets: {
			main: {
				static: false,
				objects: ["max018", "max017", "max019", "max13_004"],
			},
			legs: { 
				static: true,
				objects: ["Legs002"],
			}
		},
		objectSettings: {
			"*": {
				castShadow: true,
			},
			"max019": {
				receiveShadow: true,
			},
			"max017": {
				receiveShadow: true,
			},
			"max018": {
				receiveShadow: true,
			},
			"max13_004": {
				receiveShadow: true,
			}
		},
		textures: {
			default: "cream",
			cream: { // <-------- can hold map(texure image), bumpmap, roughnessMap, normalMap
				// relative to path decalred above
				title: "Homespun Cream",
				selectable: true,
				map: "/texture/Fabric_Cream_dif.png",
				bumpMap: "/texture/Fabric_Cream_bum.png",
				// normalMap: "/texture/Fabric_Cream_normal.png",
				styles: {
					bumpScale: .1,
					roughness: 1.3,
					reflectivity: 0,
					metalness: 0,
				},
				wrapS: 1,
				wrapT: 1,
				target: "main", // <-------------- either holds a defined "target" array of object names or targets the object by name directly if string is not predifined as a target group
			},
			solstice: {
				title: "Solstice",
				selectable: true,
				map: "/texture/Fabric_Palette_Solstice_dif.png",
				bumpMap: "/texture/Fabric_Palette_Solstice_bum.png",
				// normalMap: "/texture/Fabric_Palette_Solstice_n.png",
				styles: {
					bumpScale: .1,
					roughness: 1.3,
					reflectivity: 0,
					metalness: 0,
				},
				wrapS: 1,
				wrapT: 1,
				target: "main",
			},
			graphite: {
				title: "Graphite",
				selectable: true,
				map: "/texture/Fabric_Palette_dif.png",
				bumpMap: "/texture/Fabric_Palette_bum.png",
				// normalMap: "/texture/Palette_Graphite_n.png",
				styles: {
					bumpScale: .1,
					roughness: 1.3,
					reflectivity: 0,
					metalness: 0,
				},
				wrapS: 1,
				wrapT: 1,
				target: "main",
			},
			sterling: {
				title: "Sterling",
				selectable: true,
				map: "/texture/Fabric_Sterling_dif.png",
				bumpMap: "/texture/Fabric_Sterling_bum.png",
				// normalMap: "/texture/Homespun_Sterling_normal.png",
				styles: {
					bumpScale: .1,
					roughness: 1.3,
					reflectivity: 0,
					metalness: 0,
				},
				wrapS: 1,
				wrapT: 1,
				target: "main",
			},
			pressman: {
				title: "Pressman Parchment",
				selectable: true,
				map: "/texture/Fabric_Pressman_dif.png",
				bumpMap: "/texture/Fabric_Pressman_bum.png",
				// normalMap: "/texture/Pressman_Parchment_n.png",
				styles: {
					bumpScale: .1,
					roughness: 1.3,
					reflectivity: 0,
					metalness: 0,
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
					roughness: 1.2,
					clearCoat: .05,
					bumpScale: .02,
				},
				wrapS: 1,
				WrapT: 1,
				target: "legs",
			}
		}
	},
]