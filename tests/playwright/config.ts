export const config = {
  general: {
	consoleErrors: {
		enableTest: true,
	},
	gtm: {
		enableTest: true,
	},
	navigationDropdowns: {
		enableTest: true,
	},
	googleMaps: {
		enableTest: true,
		path: '/contact/',
	},
	headroom: {
		enableTest: true,
		path: '/',
	},
},
  blocks: {
	heroSlider: {
		enableTest: true,
		path: '/',
		settings: {
			pagination: true,
		}
	},
},
  htmlForms: {
	enableTest: true,
	path: '/contact/',
	id: '39',
	fields: {
		name: {
			type: "text",
			value: "Tom Broucke [TEST]",
		}, 
		email: {
			type: "email",
			value: "tom@tombroucke.be",
		},
		message: {
			type: "textarea",
			value: "This is a test message",
		},
		privacy: {
			type: "checkbox",
			value: true,
		},
	},
	messages: {
		error: 'Vul de vereiste velden in.',
		success: 'Bedankt! We nemen contact met je op.',
	},
},
  woocommerce: {
	enableTest: true,
	product: {
		id: '395',
		path: '/product/test/',
	},
	cart: {
		path: '/winkelwagen/',
		messages: {
			empty: 'Je winkelwagen is momenteel leeg.',
			updated: 'Winkelwagen geüpdatet',
			removed: 'verwijderd',
			undo: 'Ongedaan maken?',
		},
	},
	checkout: {
		path: '/afrekenen/',
		messages: {
			cartEmpty: 'Je winkelwagen is momenteel leeg.',
		},
		customer: {
			billingFirstName: 'Tom',
			billingLastName: 'Broucke [TEST]',
			billingAddress1: 'Teststraat 1',
			billingPostcode: '8930',
			billingCity: 'Test',
			billingCountry: 'BE',
			billingPhone: '0123456789',
			billingEmail: 'tom+test@tombroucke.be',
		}
	}
},
} as const;
