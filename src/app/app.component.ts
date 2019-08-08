import { Component, OnInit } from '@angular/core';
import * as BABYLON from 'babylonjs';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	title = 'frontline';
	private canvas;
	private engine;
	private scene;
	private camera;

	// The character
	private player;

	ngOnInit(): void {
		this.canvas = document.getElementById("renderCanvas");
		this.engine = new BABYLON.Engine(this.canvas, true);

		// Create a scene
		this.createScene();
		this.setupPlayer();
		this.setupFollowCamera();
		this.handleKeyboardInput();
		this.engine.runRenderLoop(() => this.scene.render());
	}


	// A Scene is a level or map
	private createScene(): void {
		this.scene = new BABYLON.Scene(this.engine);
		// scene.clearColor = new BABYLON.Color3.White();

		// var camera = new BABYLON.ArcRotateCamera("Camera", 1, 0.8, 10, new BABYLON.Vector3(0, 0, 0), scene);
		// scene.activeCamera.attachControl(canvas);
		var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 5, 0), this.scene);
		light.intensity = 0.7;

		// One 100 meter by 100 meter floor
		var ground = BABYLON.MeshBuilder.CreateGround("ground", {
			width: 100,
			height: 100,
			subdivisions: 1
		}, this.scene);

		// Color box
		var redMat = new BABYLON.StandardMaterial("redMat", this.scene);
		redMat.ambientColor = new BABYLON.Color3(1, 0, 0);
		var greenMat = new BABYLON.StandardMaterial("redMat", this.scene);
		greenMat.ambientColor = new BABYLON.Color3(0, 1, 0);
		greenMat.ambientColor = new BABYLON.Color3(0, 1, 0);
		// this.player.material = redMat;

		// Color ground
		ground.material = greenMat;
	};

	private setupPlayer(): void {
		// Build your player - its a shape
		this.player = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, this.scene);
		this.player.y = 2;
	}

	private setupFollowCamera(): void {
		// Must setup player before setting up camera
		this.camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 5, -10), this.scene);
		this.camera.setTarget(BABYLON.Vector3.Zero());
		// Parameters: name, position, scene
		// this.camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0, 10, -10), this.scene);
		// this.camera.setTarget(this.player);

		// The goal distance of camera from target
		this.camera.radius = 30;

		// The goal height of camera above local origin (centre) of target
		this.camera.heightOffset = 10;

		// The goal rotation of camera around local origin (centre) of target in x y plane
		this.camera.rotationOffset = 0;

		// Acceleration of camera in moving from current to goal position
		this.camera.cameraAcceleration = 0.005

		// The speed at which acceleration is halted
		this.camera.maxCameraSpeed = 10

		// NOTE:: SET CAMERA TARGET AFTER THE TARGET'S CREATION AND NOTE CHANGE FROM BABYLONJS V 2.5
		//targetMesh created here.
		// this.camera.target = this.player;   // version 2.4 and earlier
		// this.camera.lockedTarget = this.player; //version 2.5 onwards
	}

	private handleKeyboardInput(): void {
		// Keyboard events
		var inputMap = {};
		this.scene.actionManager = new BABYLON.ActionManager(this.scene);
		this.scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function(evt) {
			inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
		}));
		this.scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function(evt) {
			inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
		}));

		// Observable before each render step
		this.scene.onBeforeRenderObservable.add(() => {
			var keydown = false;
			if (inputMap["w"] || inputMap["ArrowUp"]) {
				this.player.position.z += 0.1;
				// this.camera.position.z += 0.1;
				// this.player.rotation.y = 0
				keydown = true;
			}
			if (inputMap["a"] || inputMap["ArrowLeft"]) {
				this.player.position.x -= 0.1;
				// this.camera.position.x -= 0.1;
				// this.player.rotation.y = 3 * Math.PI / 2
				keydown = true;
			}
			if (inputMap["s"] || inputMap["ArrowDown"]) {
				this.player.position.z -= 0.1;
				// this.camera.position.z -= 0.1;
				keydown = true;
			}
			if (inputMap["d"] || inputMap["ArrowRight"]) {
				this.player.position.x += 0.1;
				// this.camera.position.x += 0.1;
				// this.player.rotation.y = Math.PI / 2
				keydown = true;
			}
			if (keydown) {
				// if the character is moving then lets ove the camera too
				// this.camera.position = this.player.position.clone();
				// let ray = this.camera.getForwardRay();
				//
				// this.player.rotation.y = Math.atan2(ray.direction.x, ray.direction.z);
				//
				// this.camera.position = this.player.position.clone().add(new BABYLON.Vector3(Math.cos(this.player.rotation.y) * 2, 1, -Math.sin(this.player.rotation.y) * 2));
				// this.camera.position = this.camera.position.add(ray.direction.multiplyByFloats(-10, -10, -10));
				// if (!animating) {
				// 	animating = true;
				// 	scene.beginAnimation(skeleton, walkRange.from, walkRange.to, true);
				// }
			} else {
				// animating = false;
				// scene.stopAnimation(skeleton)
			}
		});
	}
}
