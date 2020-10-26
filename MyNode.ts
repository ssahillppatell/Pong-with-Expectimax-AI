interface MyMax {
	index: number,
	max: number
}

export class MyNode {
	private _value: number;
	private _children: MyNode[];

	constructor(val: number) {
		this._value = val;
		this._children = [];
	}

	get value(): number {
		return this._value;
	}

	get children(): MyNode[] {
		return this._children;
	}

	set children(child: MyNode[]){
		this._children = child;
	}

	addChild(child: MyNode) {
		this._children.push(child);
	}

	getMax(): MyMax {
		let max = -1;
		let i = -1;
		this._children.forEach((child, index) => {
			if(child.value > max) {
				max = child.value;
				i = index;
			}
		});
		return {
			index: i,
			max: max
		};
	}
}