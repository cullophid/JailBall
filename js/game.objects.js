game.objects = (function() {
    var that = {};
    that.init = function(options) {
        options = options || {};
        defaultFixture = options.fix || {
            density: 1.0,
            friction: 0.5,
            restitution: 0.7
        };
    };
    var b2Vec2 = Box2D.Common.Math.b2Vec2,
        b2AABB = Box2D.Collision.b2AABB,
        b2BodyDef = Box2D.Dynamics.b2BodyDef,
        b2Body = Box2D.Dynamics.b2Body,
        b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
        b2Fixture = Box2D.Dynamics.b2Fixture,
        b2World = Box2D.Dynamics.b2World,
        b2MassData = Box2D.Collision.Shapes.b2MassData,
        b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
        b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
        b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
        b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef,
        defaultFixture;

    that.Box = function(options) {
        var bodyDef = new b2BodyDef();
        var fixDef = new b2FixtureDef();
        options.fix = options.fix || {};
        fixDef.density = options.fix.density || defaultFixture.density;
        fixDef.friction = options.fix.friction || defaultFixture.friction;
        fixDef.restitution = options.fix.restiturion || defaultFixture.restitution;

        bodyDef.type = (options.type === 'static') ? b2Body.b2_staticBody : b2Body.b2_dynamicBody;
        options.position = options.position || {};
        options.position.x = options.position.x / game.scale || Math.random() + 0.1;
        options.position.y = options.position.y / game.scale || Math.random() + 0.1;
        bodyDef.position = options.position;
        fixDef.shape = new b2PolygonShape();
        var height = options.height || Math.random() * game.scale;
        var width = options.width || Math.random() * game.scale;
        fixDef.shape.SetAsBox(width / game.scale, height / game.scale);
        var body = game.world.CreateBody(bodyDef);
        body.CreateFixture(fixDef);
        game.objects.prototype = body;

    };
    that.Ball = function(options) {
        function createBody() {
            var bodyDef = new b2BodyDef(),
                fixDef = new b2FixtureDef(),
                radius = 16,
                body;
            options.fix = options.fix || {};
            fixDef.density = options.fix.density || defaultFixture.density;
            fixDef.friction = options.fix.friction || defaultFixture.friction;
            fixDef.restitution = options.fix.restiturion || defaultFixture.restitution;
            bodyDef.type = (options.type === 'static') ? b2Body.b2_staticBody : b2Body.b2_dynamicBody;
            options.position = options.position || {};
            options.position.x = options.position.x / game.scale || Math.random() + 0.1;
            options.position.y = options.position.y / game.scale || Math.random() + 0.1;
            bodyDef.position = options.position;
            fixDef.shape = new b2CircleShape(radius / game.scale || Math.random() + 0.1);
            body = game.world.CreateBody(bodyDef);
            body.CreateFixture(fixDef);
            return body;
        }

        function createSkin() {
            var data = {
                images: ["img/balls.png"],
                frames: {
                    width: 64,
                    height: 64,
                    count: 4,
                    regX: 5,
                    regY: 8
                },
                animations: {
                    bounce: {
                        frames: [0, 1, 2, 3, 2, 1, 0],
                        next: "steady",
                        frequency: 2
                    },
                    fly: [1],
                    steady: [0]
                }
            };
            var spriteSheet = new createjs.SpriteSheet(data);
            var skin = new createjs.BitmapAnimation(spriteSheet);
            console.log(spriteSheet);
            skin.gotoAndPlay("steady");
            skin.x = Math.round(Math.random() * 500);
            skin.y = -30;
            skin.regX = 25; // important to set origin point to center of your bitmap
            skin.regY = 25;
            game.stage.addChild(skin);
            return skin;
        }
        var body = createBody();
        var skin = createSkin();
        game.objects.Actor.call(this, body, skin);

    };
    that.Geezer = function() {
        function createBody() {
            var bodyDef = new b2BodyDef(),
                fixDef = new b2FixtureDef(),
                points = [{
                    x: 100,
                    y: 130
                }, {
                    x: 150,
                    y: 90
                }, {
                    x: 235,
                    y: 90
                },{
                    x: 250,
                    y: 120
                },
                {
                    x: 230,
                    y: 250
                },
                {
                    x: 120,
                    y: 250
                },
                {
                    x:110,
                    y:240
                }
                ],
                i,
                vec,
                body;
            fixDef.density =  defaultFixture.density;
            fixDef.friction = defaultFixture.friction;
            fixDef.restitution = defaultFixture.restitution;
            bodyDef.type = b2Body.b2_staticBody;
            bodyDef.position = {
                x: 500 / game.scale,
                y : 190 / game.scale
            };

            fixDef.shape = new b2PolygonShape();

            for (i = 0; i < points.length; i += 1) {
                vec = new b2Vec2();
                vec.Set(points[i].x / game.scale, points[i].y / game.scale);
                points[i] = vec;
            }

            fixDef.shape.SetAsArray(points, points.length);
            body = game.world.CreateBody(bodyDef);
            body.CreateFixture(fixDef);
            return body;
        }

        function createSkin() {
            var data = {
                images: ["img/geezer.png"],
                frames: {
                    width: 180,
                    height: 184,
                    count: 4,
                    regX: -110,
                    regY: -100
                },
                animations: {
                    "sit":[0]
                }
            };
            var spriteSheet = new createjs.SpriteSheet(data);
            var skin = new createjs.BitmapAnimation(spriteSheet);
            console.log(spriteSheet);
            skin.gotoAndPlay("sit");
            skin.x = Math.round(Math.random() * 500);
            skin.y = -30;
            skin.regX = 25; // important to set origin point to center of your bitmap
            skin.regY = 25;
            game.stage.addChild(skin);
            return skin;
        }
        var body = createBody();
        var skin = createSkin();
        game.objects.Actor.call(this, body, skin);
    };

    that.Actor = function(body, skin) {
        this.body = body;
        this.skin = skin;
        this.update = function() { // translate box2d positions to pixels
            var x = this.body.m_linearVelocity.x,
                y = this.body.m_linearVelocity.y,
                limit = 6;

            this.skin.x = this.body.GetWorldCenter().x * game.scale;
            this.skin.y = this.body.GetWorldCenter().y * game.scale;

            if (skin.currentAnimation === "bounce") {
                console.log("bounce");
                return;
            }
            if (x > limit || y > limit) {
                // find the velocity raptor... i mean vector
                var angle = Math.atan(Math.abs(y) / Math.abs(x)) * (180 / Math.PI);
                if (y > 0 && x < 0) {
                    angle = 180 - angle;
                } else if (y < 0 && x < 0) {
                    angle = 180 + angle;
                } else if (y < 0 && x > 0) {
                    angle = 360 - angle
                }
                skin.rotation = angle; // math it works bitches
                skin.gotoAndPlay("fly");
            } else {

                this.skin.rotation = this.body.GetAngle() * (180 / Math.PI);
                skin.gotoAndPlay("steady");
            }
        };
    };
    return that;
})();