import * as THREE from "../build/three.module.js";

// App 클래스를 정의
class App {
	constructor() {
		// id가 webgl-container인 div 요소를 얻어 와서 divContainer라는 이름으로 저장
		const divContainer = document.querySelector("#webgl-container");
		// divContainer를 클래스의 field로 정의(divContainer를 this._divContainer로 다른 method에서 참조할 수 있도록 하기 위해)
		this._divContainer = divContainer;

		// renderer 객체는 three.js의 webGLRenderer라는 클래스로 생성
		// 생성 시 다양한 옵션 설정 가능.. antialias를 true로 설정(3차원 장면이 렌더링될 때 오브젝트들의 경계선이 계단 현상 없이 부드럽게 표현됨)
		const renderer = new THREE.WebGLRenderer({ antialias: true });
		// renderer 객체에 setPixelRatio method를 호출해서 픽셀의 ratio값 설정
		// pixel ratio 값은 window의 devicePixelRatio 속성으로 쉽게 얻을 수 있음
		renderer.setPixelRatio(window.devicePixelRatio);
		// 생성된 renderer의 domElement(canvas 타입의 dom 객체)를 id가 webgl-container인 divContainer의 자식으로 추가
		divContainer.appendChild(renderer.domElement);
		// renderer가 다른 method에서 참조할 수 있도록 this._renderer로 정의
		this._renderer = renderer;

		// Scene 객체(three.js 라이브러리에서 Scene 클래스로 간단히 생성)를 생성하는 코드
		const scene = new THREE.Scene();
		// scene 객체를 field화
		this._scene = scene;

		// camera 객체를 구성하는 _setupCamera method 호출
		this._setupCamera();
		// light(광원)을 설정하는 _setupLight method 호출
		this._setupLight();
		// 3차원 모델을 설정하는 _setupModel method 호출
		this._setupModel();

		// 창 크기가 변경되면 발생하는 onresize 이벤트에 클래스의 resize method를 지정
		// (renderer나 camera는 창 크기가 변경될 때 마다 그 크기에 맞게 속성 값을 재설정해줘야 하므로 resize 이벤트 필요)
		// resize 이벤트에 resize method를 지정할 때 bind 사용
		// resize method 안에서 this가 가리키는 객체가 이벤트 객체가 아닌 App 클래스의 객체가 되도록 하기 위함
		window.onresize = this.resize.bind(this);
		// 생성자에서 호출 <- render나 camera의 창 크기에 맞게 설정해주게 됨
		this.resize();

		// render method를 requestAnimationFrame이라는 API에 넘겨줘서 호출
		// render method는 실제로 3차원 그래픽 장면을 만들어주는 method
		// 이 method를 requestAnimationFrame에 넘겨줘서 requestAnimationFrame은 적당한 시점에 또한 최대한 빠르게 render method 호출해줌
		// bind 통해서 넘겨주는 이유는 render method의 코드 안에서 사용되는 this가 이 app 클래스의 객체를 가리키도록 하기 위함
		requestAnimationFrame(this.render.bind(this));
	}

	_setupCamera() {
		// three.js가 3차원 그래픽을 출력할 영역에 대한 가로, 세로에 대한 크기
		const width = this._divContainer.clientWidth;
		const height = this._divContainer.clientHeight;
		// 카메라 객체 생성
		const camera = new THREE.PerspectiveCamera(
			75, //
			width / height,
			0.1,
			100
		);
		camera.position.z = 2;
		this._camera = camera;
	}

	// 광원 생성을 위해 광원의 색상, 세기 값 필요
	_setupLight() {
		const color = 0xffffff;
		const intensity = 1;
		const light = new THREE.DirectionalLight(color, intensity);
		// 광원의 위치 잡기
		light.position.set(-1, 2, 4);
		// 생성한 광원을 scene 객체의 구성 요소로 추가
		this._scene.add(light);
	}

	_setupModel() {
		const geometry = new THREE.BoxGeometry(1, 1, 1); // 가로, 세로, 깊이
		const material = new THREE.MeshPhongMaterial({ color: 0x44a88 }); // 파란색 계열의 재질 생성

		const cube = new THREE.Mesh(geometry, material);

		this._scene.add(cube);
		this._cube = cube;
	}

	resize() {
		const width = this._divContainer.clientWidth;
		const height = this._divContainer.clientHeight;

		this._camera.aspect = width / height;
		this._camera.updateProjectionMatrix();

		this._renderer.setSize(width, height);
	}

	// time 인자는 렌더링이 처음 시작된 이후 경과된 시간값으로 단위가 milli-second
	// time 인자를 scene의 애니메이션에 이용 가능
	render(time) {
		// renderer가 scene을 카메라의 시점으로 렌더링
		this._renderer.render(this._scene, this._camera);
		this.update(time); // 속성값을 변경하여 애니메이션 효과 발생
		requestAnimationFrame(this.render.bind(this)); // 계속 render method가 반복 호출(적당한 시점에 최대한 빠르게 호출)
	}

	update(time) {
		time *= 0.001; // second unit
		this._cube.rotation.x = time;
		this._cube.rotation.y = time;
	}
}

// window의 onload에서 App 클래스의 객체를 생성
window.onload = function () {
	new App();
};
