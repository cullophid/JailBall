$(document).ready(function() {
    game.init();
});

var game = (function() {
    var game = {},
    actors = [],
        Actor,
        Box,
        ball,
        geezer,
        room = [],
        b2Vec2 = Box2D.Common.Math.b2Vec2,
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
        objects, events, selectedBody,
        b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef;

    game.scale = 100;

    function createRoom() {
        var background = new createjs.Bitmap("img/room.png");

        background.x = 0;
        background.y = 0;
        game.stage.addChild(background);

        room.push(new Box({ // top
            type: 'static',
            width: game.width,
            height: 1,
            position: {
                x: game.width / 2,
                y: 0.5
            }
        }));
        room.push(new Box({ // right
            type: 'static',
            width: 1,
            height: game.height,
            position: {
                x: game.width - 0.5,
                y: game.height / 2
            }
        }));

        room.push(new Box({ // bottom
            type: 'static',
            width: game.width,
            height: 1,
            position: {
                x: game.width / 2,
                y: game.height - 0.5
            }
        }));
        room.push(new Box({ // left
            type: 'static',
            width: 1,
            height: game.height,
            position: {
                x: 0.5,
                y: game.height / 2
            }
        }));
        bench = new Box({
           type: 'static',
            width: 110,
            height: 80,
            position: {
                x:  790,
                y: 520
            }
        })


    }
    game.init = function() {
        console.log("init");
        game.canvas = document.getElementById("gameCanvas");
        game.height = $(game.canvas).height();
        game.width = $(game.canvas).width();
        console.log(game.height);
        game.stage = new createjs.Stage(game.canvas);
        game.objects.init();
        game.events.init();
        Box = game.objects.Box;
        Ball = game.objects.Ball;
        Actor = game.objects.Actor;
        events = game.events;

        game.run();

    };
    game.run = function() {
        game.world = new b2World(new b2Vec2(0, 9.8), true);
        createRoom();
        ball = new Ball({
            position: {
                x: 200,
                y: game.height - 30
            }
        });
        geezer = new game.objects.Geezer();
        var listener = new Box2D.Dynamics.b2ContactListener;
        listener.BeginContact = function(contact) {
            // console.log(contact.GetFixtureA());
            var obj;
            function bounce() {
                if (obj === room[0].body || obj === room[2].body) { // top or bottom
                    ball.skin.rotation = 90;
                    ball.skin.gotoAndPlay("fly");
                } else if (obj.body === room[1].body || room[3].body) { //walls
                    ball.skin.rotation = 0;
                    ball.skin.gotoAndPlay("fly");
                }
            }
            if (contact.GetFixtureA().GetBody() === ball.body) {
                obj = contact.GetFixtureB().GetBody();
                bounce();
            } else if (contact.GetFixtureB().GetBody() === ball.body) {
                obj = contact.GetFixtureB().GetBody()
                bounce();
            }
            
        }
        listener.EndContact = function(contact) {
            // console.log(contact.GetFixtureA().GetBody().GetUserData());
        }
        listener.PostSolve = function(contact, impulse) {

        }
        listener.PreSolve = function(contact, oldManifold) {

        }
        this.world.SetContactListener(listener);
        //setup debug draw

        var debugDraw = new b2DebugDraw();
        debugDraw.SetSprite(document.getElementById("debugCanvas").getContext("2d"));
        debugDraw.SetDrawScale(game.scale);
        debugDraw.SetFillAlpha(0.5);
        debugDraw.SetLineThickness(1.0);
        debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
        game.world.SetDebugDraw(debugDraw);


        createjs.Ticker.addEventListener("tick", update);
        createjs.Ticker.useRAF = true;
        createjs.Ticker.setFPS(60);
        // createjs.Ticker.init();
        // window.setInterval(game.update, 1000 / 60);

    };

    function update() {
        if (game.isMouseDown && (!game.mouseJoint)) {
            var body = game.getBodyAtMouse();
            if (body) {
                var md = new b2MouseJointDef();
                md.bodyA = game.world.GetGroundBody();
                md.bodyB = body;
                md.target.Set(body.GetPosition().x, body.GetPosition().y);
                md.collideConnected = true;
                md.maxForce = 500.0 * body.GetMass();
                game.mouseJoint = game.world.CreateJoint(md);
                body.SetAwake(true);
            }
        }

        if (game.mouseJoint) {
            if (game.isMouseDown) {
                game.mouseJoint.SetTarget(new b2Vec2(game.mouseX, game.mouseY));
            } else {
                game.world.DestroyJoint(game.mouseJoint);
                game.mouseJoint = null;
            }
        }
        ball.update();
        geezer.update();
        game.world.Step(1 / 60, 10, 10);
        game.world.m_debugDraw.m_sprite.graphics.clear();
        game.world.DrawDebugData();
        game.world.ClearForces();
        game.stage.update();
    }
    game.getBodyAtMouse = function() {
        game.mousePVec = new b2Vec2(game.mouseX, game.mouseY);
        var aabb = new b2AABB();
        aabb.lowerBound.Set(game.mouseX - 0.001, game.mouseY - 0.001);
        aabb.upperBound.Set(game.mouseX + 0.001, game.mouseY + 0.001);
        // Query the world for overlapping shapes.

        game.selectedBody = null;
        game.world.QueryAABB(getBodyCB, aabb);
        return game.selectedBody;
    };

    function getBodyCB(fixture) {
        console.log("callback");
        if (fixture.GetBody().GetType() !== b2Body.b2_staticBody) {
            if (fixture.GetShape().TestPoint(fixture.GetBody().GetTransform(), game.mousePVec)) {
                game.selectedBody = fixture.GetBody();
                return false;
            }
        }
        return true;
    }
    return game;
})();