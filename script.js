
// = 010 ======================================================================
// このサンプルの実行結果の見た目は、ほとんど 009 と同じです。
// コードにコメントを大量に追記していますので、各種パラメータのそれぞれが、どう
// いったことに影響を及ぼすのか、あるいはどういった意味合いを持つのか、しっかり
// と確認しておきましょう。
// 講義スライドのなかにある図式も一緒に眺めながら理解を深めるといいでしょう。
// また、それらのパラメータの意味を踏まえながら、スクリーンのサイズが変更となっ
// たとき、どのように処理すればいいのかについても考えてみましょう。
// ============================================================================

(() => {
    window.addEventListener('load', () => {
        // 汎用変数の宣言
        let width = window.innerWidth;
        let height = window.innerHeight;
        let targetDOM = document.getElementById('webgl');

        let run = true;
        let scene;
        let camera;
        let controls;
        let renderer;
        let geometry;
        let material;
        let materialPoint;
        let cubes = [];
        let sphere;
        let cone;
        let torus;
        let directionalLight;
        let ambientLight;
        let axesHelper;
        let isDown = false;

        const CAMERA_PARAM = {
            fovy: 1000,               // field of view Y の略
            aspect: width / height, // カメラが撮影する空間のアスペクト比
            near: 0.1,              // カメラからニアクリップ面までの距離
            far: 26.0,              // カメラからファークリップ面までの距離
            x: 0.0,                 // カメラの X 座標
            y: 0.0,                 // カメラの Y 座標
            z: 7.0,                 // カメラの Z 座標
            lookAt: new THREE.Vector3(0.0, 0.0, 0.0) // カメラの注視する座標
        };
        const RENDERER_PARAM = {
            clearColor: 0x333333, // 背景をクリアする色
            width: width,         // レンダラ（スクリーン）の幅
            height: height        // レンダラ（スクリーン）の高さ
            // - 補足 ---------------------------------------------------------
            // レンダラの幅と高さは、ブラウザウィンドウ内に設置したスクリーン、
            // つまり canvas と一致させるのが普通です。しかし、よくよく考えてみ
            // ると、カメラの設定項目の中にも幅や高さから影響を受ける部分がある
            // ことに気がつくでしょう。
            // このような異なるタイミングで別々に設定される幅や高さに関する設定
            // は、どうしても最初は冗長に見えると思いますが、不整合を起こさない
            // ように注意深く設定しなければならないものです。
            // ちょっと面倒に感じるかもしれませんが、覚えておきましょう。
            // ----------------------------------------------------------------
        };
        // const MATERIAL_PARAM = {
        //     color: 0x579BBC,   // マテリアルの持つ色
        //     specular: 0xffffff // スペキュラ（反射光）の持つ色
        // };
				const MATERIAL_PARAM_RED = {
						// color: 0xdc143c,   // マテリアルの持つ色
						color: 0xb30000,   // マテリアルの持つ色
						specular: 0xffffff // スペキュラ（反射光）の持つ色
				};
				const MATERIAL_PARAM_DARK_RED = {
						color: 0x800000,   // マテリアルの持つ色
						specular: 0xffffff // スペキュラ（反射光）の持つ色
				};
				const MATERIAL_PARAM_BLACK = {
						color: 0x220000,   // マテリアルの持つ色
						specular: 0xffffff // スペキュラ（反射光）の持つ色
				};

        const DIRECTIONAL_LIGHT_PARAM = {
            color: 0xffffff, // ディレクショナルライトの持つ色
            intensity: 1.0,  // ディレクショナルライトの強度
            x: 1.0,          // ディレクショナルライトの X 座標
            y: 1.0,          // ディレクショナルライトの Y 座標
            z: 1.0           // ディレクショナルライトの Z 座標
        };
        const AMBIENT_LIGHT_PARAM = {
            color: 0xffffff, // アンビエントライトの持つ色
            intensity: 0.24   // アンビエントライトの強度
        };

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(
            CAMERA_PARAM.fovy,
            CAMERA_PARAM.aspect,
            CAMERA_PARAM.near,
            CAMERA_PARAM.far
        );
        camera.position.x = CAMERA_PARAM.x;
        camera.position.y = CAMERA_PARAM.y;
        camera.position.z = CAMERA_PARAM.z;
        camera.lookAt(CAMERA_PARAM.lookAt);

        renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(new THREE.Color(RENDERER_PARAM.clearColor));
        renderer.setSize(RENDERER_PARAM.width, RENDERER_PARAM.height);
        targetDOM.appendChild(renderer.domElement);

        controls = new THREE.OrbitControls(camera, renderer.domElement);

        let materialRed = new THREE.MeshPhongMaterial(MATERIAL_PARAM_RED);
        let materialDarkRed = new THREE.MeshPhongMaterial(MATERIAL_PARAM_DARK_RED);
        let materialBlack = new THREE.MeshPhongMaterial(MATERIAL_PARAM_BLACK);

        // ボックスジオメトリの生成とメッシュ化
				// cubeを作成
        geometry = new THREE.BoxGeometry(1.0, 1.0, 1.0);
				for (let count = 0; count < 100 ; count++ ) {
					let tmpMaterial;
					if ((Math.floor(count/10)) % 2 == 1 ) {

						tmpMaterial = count % 2 == 1 ? materialRed: materialDarkRed;


					} else {

						tmpMaterial = count % 2 == 1 ? materialDarkRed: materialBlack;

					}

	        cubes[count] = new THREE.Mesh(geometry, tmpMaterial);
	        cubes[count].position.x = -4.5 + count % 10;
	        cubes[count].position.y = -4.5 + Math.floor(count/10);
					cubes[count].rotation.y = 0.002 * count;
	        scene.add(cubes[count]);
				}

        directionalLight = new THREE.DirectionalLight(
            DIRECTIONAL_LIGHT_PARAM.color,
            DIRECTIONAL_LIGHT_PARAM.intensity
        );
        directionalLight.position.x = DIRECTIONAL_LIGHT_PARAM.x;
        directionalLight.position.y = DIRECTIONAL_LIGHT_PARAM.y;
        directionalLight.position.z = DIRECTIONAL_LIGHT_PARAM.z;
        scene.add(directionalLight);

        ambientLight = new THREE.AmbientLight(
            AMBIENT_LIGHT_PARAM.color,
            AMBIENT_LIGHT_PARAM.intensity
        );
        scene.add(ambientLight);

        axesHelper = new THREE.AxesHelper(5.0);
        // scene.add(axesHelper);

        window.addEventListener('keydown', (eve) => {
            run = eve.key !== 'Escape';
        }, false);

        window.addEventListener('mousedown', () => {
            isDown = true;
        }, false);
        window.addEventListener('mouseup', () => {
            isDown = false;
        }, false);

        // - ウィンドウサイズの変更に対応 -------------------------------------
        // JavaScript ではブラウザウィンドウの大きさが変わったときに resize イベ
        // ントが発生します。three.js や WebGL のプログラムを書く際は、ウィンド
        // ウや canvas の大きさが変化したときは、カメラやレンダラなどの各種オブ
        // ジェクトに対してもこの変更を反映してやる必要があります。
        // three.js の場合であれば、レンダラとカメラに対し、以下のように設定して
        // やればいいでしょう。
        // --------------------------------------------------------------------
        window.addEventListener('resize', () => {
            // レンダラの大きさを設定
            renderer.setSize(window.innerWidth, window.innerHeight);
            // カメラが撮影する視錐台のアスペクト比を再設定
            camera.aspect = window.innerWidth / window.innerHeight;
            // カメラのパラメータが変更されたときは行列を更新する
            // ※これについてはいずれもう少し詳しく解説します
            camera.updateProjectionMatrix();
        }, false);

        render();
        function render(){
            if(run){requestAnimationFrame(render);}

            if(isDown === true){
							for (let count = 0; count < cubes.length; count ++ ) {
						     cubes[count].rotation.y    += 0.02;
							}

            }

            renderer.render(scene, camera);
        }
    }, false);
})();
