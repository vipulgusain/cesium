/*global defineSuite*/
defineSuite([
         'Scene/CameraSpindleController',
         'Core/Ellipsoid',
         'Core/Cartographic2',
         'Core/Cartesian2',
         'Core/Cartesian3',
         'Core/Math',
         'Core/Transforms',
         'Scene/Camera',
         'Scene/PerspectiveFrustum'
     ], function(
         CameraSpindleController,
         Ellipsoid,
         Cartographic2,
         Cartesian2,
         Cartesian3,
         CesiumMath,
         Transforms,
         Camera,
         PerspectiveFrustum) {
    "use strict";
    /*global it,expect,beforeEach,afterEach*/

    var position;
    var up;
    var dir;
    var right;
    var camera;
    var frustum;
    var moverate;
    var rotaterate;
    var csc, csc2;

    beforeEach(function() {
        moverate = 3.0;
        rotaterate = CesiumMath.PI_OVER_TWO;
        position = Cartesian3.getUnitZ();
        up = Cartesian3.getUnitY();
        dir = Cartesian3.getUnitZ().negate();
        right = dir.cross(up);

        frustum = new PerspectiveFrustum();
        frustum.near = 1;
        frustum.far = 2;
        frustum.fovy = (Math.PI) / 3;
        frustum.aspect = 1;

        camera = new Camera(document);
        camera.position = position;
        camera.up = up;
        camera.direction = dir;
        camera.right = right;
        camera.frustum = frustum;

        csc = new CameraSpindleController(document, camera, Ellipsoid.getWgs84());
        csc.constrainedZAxis = false;
    });

    afterEach(function() {
        try {
            csc = csc && csc.destroy();
            csc2 = csc2 && csc2.destroy();
        } catch(e) {}
    });

    it("setEllipsoid", function() {
        expect(csc.getEllipsoid()).toEqual(Ellipsoid.getWgs84());
        csc.setEllipsoid(Ellipsoid.getUnitSphere());
        expect(csc.getEllipsoid()).toEqual(Ellipsoid.getUnitSphere());
    });

    it("setReferenceFrame", function() {
        var transform = Transforms.eastNorthUpToFixedFrame(Ellipsoid.getUnitSphere().cartographicDegreesToCartesian(new Cartographic2(-76.0, 40.0)));
        csc.setReferenceFrame(transform, Ellipsoid.getUnitSphere());
        expect(csc.getEllipsoid()).toEqual(Ellipsoid.getUnitSphere());
        expect(camera.transform.equals(transform)).toEqual(true);
    });

    it("move up", function() {
        csc.moveUp(rotaterate);
        expect(camera.up.equalsEpsilon(dir.negate(), CesiumMath.EPSILON15)).toEqual(true);
        expect(camera.direction.equalsEpsilon(up, CesiumMath.EPSILON15)).toEqual(true);
        expect(camera.right.equalsEpsilon(right, CesiumMath.EPSILON15)).toEqual(true);
        expect(camera.position.equalsEpsilon(Cartesian3.getUnitY().negate(), CesiumMath.EPSILON15)).toEqual(true);
    });

    it("move up with constrained Z", function() {
        csc.moveUpWithConstrainedZ(rotaterate);
        expect(camera.up.equalsEpsilon(up, CesiumMath.EPSILON15)).toEqual(true);
        expect(camera.direction.equalsEpsilon(dir, CesiumMath.EPSILON15)).toEqual(true);
        expect(camera.right.equalsEpsilon(right, CesiumMath.EPSILON15)).toEqual(true);
        expect(camera.position.equalsEpsilon(position, CesiumMath.EPSILON15)).toEqual(true);
    });

    it("move down", function() {
        csc.moveDown(rotaterate);
        expect(camera.up.equalsEpsilon(dir, CesiumMath.EPSILON15)).toEqual(true);
        expect(camera.direction.equalsEpsilon(up.negate(), CesiumMath.EPSILON15)).toEqual(true);
        expect(camera.right.equalsEpsilon(right, CesiumMath.EPSILON15)).toEqual(true);
        expect(camera.position.equalsEpsilon(Cartesian3.getUnitY(), CesiumMath.EPSILON15)).toEqual(true);
    });

    it("move down with constrained Z", function() {
        csc.moveDownWithConstrainedZ(-rotaterate);
        expect(camera.up.equalsEpsilon(up, CesiumMath.EPSILON15)).toEqual(true);
        expect(camera.direction.equalsEpsilon(dir, CesiumMath.EPSILON15)).toEqual(true);
        expect(camera.right.equalsEpsilon(right, CesiumMath.EPSILON15)).toEqual(true);
        expect(camera.position.equalsEpsilon(position, CesiumMath.EPSILON15)).toEqual(true);
    });

    it("move left", function() {
        csc.moveLeft(rotaterate);
        expect(camera.up.equalsEpsilon(up, CesiumMath.EPSILON15)).toEqual(true);
        expect(camera.direction.equalsEpsilon(right, CesiumMath.EPSILON15)).toEqual(true);
        expect(camera.right.equalsEpsilon(dir.negate(), CesiumMath.EPSILON15)).toEqual(true);
        expect(camera.position.equalsEpsilon(Cartesian3.getUnitX().negate(), CesiumMath.EPSILON15)).toEqual(true);
    });

    it("move left with contrained Z", function() {
        csc.moveLeftWithConstrainedZ(rotaterate);
        expect(camera.up.equalsEpsilon(Cartesian3.getUnitX(), CesiumMath.EPSILON15)).toEqual(true);
        expect(camera.direction.equalsEpsilon(Cartesian3.getUnitZ().negate(), CesiumMath.EPSILON15)).toEqual(true);
        expect(camera.right.equalsEpsilon(Cartesian3.getUnitY().negate(), CesiumMath.EPSILON15)).toEqual(true);
        expect(camera.position.equalsEpsilon(Cartesian3.getUnitZ(), CesiumMath.EPSILON15)).toEqual(true);
    });

    it("move right", function() {
        csc.moveRight(rotaterate);
        expect(camera.up.equalsEpsilon(up, CesiumMath.EPSILON15)).toEqual(true);
        expect(camera.direction.equalsEpsilon(right.negate(), CesiumMath.EPSILON15)).toEqual(true);
        expect(camera.right.equalsEpsilon(dir, CesiumMath.EPSILON15)).toEqual(true);
        expect(camera.position.equalsEpsilon(Cartesian3.getUnitX(), CesiumMath.EPSILON15)).toEqual(true);
    });

    it("move right with contrained Z", function() {
        csc.moveRightWithConstrainedZ(rotaterate);
        expect(camera.up.equalsEpsilon(Cartesian3.getUnitX().negate(), CesiumMath.EPSILON15)).toEqual(true);
        expect(camera.direction.equalsEpsilon(Cartesian3.getUnitZ().negate(), CesiumMath.EPSILON15)).toEqual(true);
        expect(camera.right.equalsEpsilon(Cartesian3.getUnitY(), CesiumMath.EPSILON15)).toEqual(true);
        expect(camera.position.equalsEpsilon(Cartesian3.getUnitZ(), CesiumMath.EPSILON15)).toEqual(true);
    });

    it("zoom in", function() {
        camera.position = new Cartesian3();
        csc.zoomIn(moverate);
        expect(camera.position.equals(new Cartesian3(0.0, 0.0, -moverate))).toEqual(true);
        expect(camera.up.equals(up)).toEqual(true);
        expect(camera.direction.equals(dir)).toEqual(true);
        expect(camera.right.equals(right)).toEqual(true);
    });

    it("zoom out", function() {
        camera.position = new Cartesian3();
        csc.zoomOut(moverate);
        expect(camera.position.equals(new Cartesian3(0.0, 0.0, moverate))).toEqual(true);
        expect(camera.up.equals(up)).toEqual(true);
        expect(camera.direction.equals(dir)).toEqual(true);
        expect(camera.right.equals(right)).toEqual(true);
    });

    it("rotate", function() {
        var camera2 = new Camera(document);
        camera2.position = position;
        camera2.up = up;
        camera2.direction = dir;
        camera2.right = right;
        camera2.frustum = frustum;

        csc2 = new CameraSpindleController(document, camera2, Ellipsoid.getWgs84());
        var angle = CesiumMath.PI_OVER_TWO;

        csc.rotate(new Cartesian3(Math.cos(CesiumMath.PI_OVER_FOUR), Math.sin(CesiumMath.PI_OVER_FOUR), 0.0), angle);

        csc2.moveLeft(angle);
        csc2.moveUp(angle);

        expect(camera.position.equalsEpsilon(camera2.position, CesiumMath.EPSILON15));
        expect(camera.direction.equalsEpsilon(camera2.direction, CesiumMath.EPSILON15));
        expect(camera.up.equalsEpsilon(camera2.up, CesiumMath.EPSILON15));
        expect(camera.right.equalsEpsilon(camera2.right, CesiumMath.EPSILON15));
    });

    it("isDestroyed", function() {
        expect(csc.isDestroyed()).toEqual(false);
        csc.destroy();
        expect(csc.isDestroyed()).toEqual(true);
    });
});
