import { useEffect, useRef } from 'react';
import * as THREE from 'three';

import logo from '../assets/logo.png';
import landingIllustration from '../assets/landing-illustration.png';
import globalConversations from '../assets/global-conversations.png';

const LandingPage = ({ onEnter }) => {
  const canvasHolderRef = useRef(null);

  useEffect(() => {
    const holder = canvasHolderRef.current;

    if (!holder) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    camera.position.z = 34;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, 2)
    );

    holder.appendChild(renderer.domElement);


    /* =====================================================
       NETWORK NODES
    ===================================================== */

    const NODE_COUNT = 90;

    const nodes = [];

    const nodeGroup =
      new THREE.Group();

    scene.add(nodeGroup);

    const colorA =
      new THREE.Color(0x2dd8b8);

    const colorB =
      new THREE.Color(0x3b6bf0);

    const colorC =
      new THREE.Color(0x4f3ce0);

    const randRange = (
      min,
      max
    ) =>
      min +
      Math.random() *
        (max - min);


    const nodeGeo =
      new THREE.SphereGeometry(
        0.14,
        10,
        10
      );


    for (
      let i = 0;
      i < NODE_COUNT;
      i++
    ) {
      const t =
        Math.random();

      const col =
        t < 0.5
          ? colorA
              .clone()
              .lerp(
                colorB,
                t * 2
              )
          : colorB
              .clone()
              .lerp(
                colorC,
                (t - 0.5) * 2
              );

      const mat =
        new THREE.MeshBasicMaterial({
          color: col,
          transparent: true,
          opacity:
            randRange(
              0.5,
              1
            ),
        });

      const mesh =
        new THREE.Mesh(
          nodeGeo,
          mat
        );

      mesh.position.set(
        randRange(-24, 24),
        randRange(-14, 14),
        randRange(-14, 14)
      );

      nodes.push({
        mesh,
        basePos:
          mesh.position.clone(),
        speed:
          randRange(
            0.15,
            0.45
          ),
        offset:
          Math.random() *
          Math.PI *
          2,
      });

      nodeGroup.add(mesh);
    }


    /* =====================================================
       CONNECTION LINES
    ===================================================== */

    const lineMat =
      new THREE.LineBasicMaterial({
        color: 0x2dd8b8,
        transparent: true,
        opacity: 0.22,
      });

    const linePairs = [];


    for (
      let i = 0;
      i < NODE_COUNT;
      i++
    ) {
      for (
        let j = i + 1;
        j < NODE_COUNT;
        j++
      ) {
        const distance =
          nodes[
            i
          ].basePos.distanceTo(
            nodes[
              j
            ].basePos
          );

        if (
          distance <
          7.5
        ) {
          linePairs.push([
            i,
            j,
          ]);
        }
      }
    }


    const lineGeo =
      new THREE.BufferGeometry();

    const linePositions =
      new Float32Array(
        linePairs.length *
          6
      );

    lineGeo.setAttribute(
      'position',
      new THREE.BufferAttribute(
        linePositions,
        3
      )
    );

    const lineSegments =
      new THREE.LineSegments(
        lineGeo,
        lineMat
      );

    scene.add(
      lineSegments
    );


    /* =====================================================
       MOVING PULSES
    ===================================================== */

    const PULSE_COUNT = 14;

    const pulses = [];

    const pulseGeo =
      new THREE.SphereGeometry(
        0.22,
        8,
        8
      );


    for (
      let i = 0;
      i < PULSE_COUNT;
      i++
    ) {
      const mat =
        new THREE.MeshBasicMaterial({
          color: 0x9df5e3,
          transparent: true,
          opacity: 0.9,
        });

      const mesh =
        new THREE.Mesh(
          pulseGeo,
          mat
        );

      scene.add(mesh);

      pulses.push({
        mesh,

        pair:
          linePairs[
            Math.floor(
              Math.random() *
                linePairs.length
            )
          ],

        t:
          Math.random(),

        speed:
          randRange(
            0.004,
            0.011
          ),
      });
    }


    /* =====================================================
       BACKGROUND DUST
    ===================================================== */

    const dustCount = 200;

    const dustGeo =
      new THREE.BufferGeometry();

    const dustPos =
      new Float32Array(
        dustCount * 3
      );


    for (
      let i = 0;
      i < dustCount;
      i++
    ) {
      dustPos[
        i * 3
      ] =
        randRange(
          -40,
          40
        );

      dustPos[
        i * 3 + 1
      ] =
        randRange(
          -25,
          25
        );

      dustPos[
        i * 3 + 2
      ] =
        randRange(
          -30,
          10
        );
    }


    dustGeo.setAttribute(
      'position',
      new THREE.BufferAttribute(
        dustPos,
        3
      )
    );


    const dustMat =
      new THREE.PointsMaterial({
        color: 0x3b6bf0,
        size: 0.06,
        transparent: true,
        opacity: 0.5,
      });


    const dust =
      new THREE.Points(
        dustGeo,
        dustMat
      );

    scene.add(dust);


    /* =====================================================
       MOUSE INTERACTION
    ===================================================== */

    let mouseX = 0;
    let mouseY = 0;


    const handleMouseMove = (
      e
    ) => {
      mouseX =
        e.clientX /
          window.innerWidth -
        0.5;

      mouseY =
        e.clientY /
          window.innerHeight -
        0.5;
    };


    window.addEventListener(
      'mousemove',
      handleMouseMove
    );


    /* =====================================================
       ANIMATION
    ===================================================== */

    const clock =
      new THREE.Clock();

    let animationId;


    const animate = () => {
      animationId =
        requestAnimationFrame(
          animate
        );

      const t =
        clock.getElapsedTime();


      nodes.forEach(
        (n) => {
          n.mesh.position.x =
            n.basePos.x +
            Math.sin(
              t *
                n.speed +
                n.offset
            ) *
              0.6;

          n.mesh.position.y =
            n.basePos.y +
            Math.cos(
              t *
                n.speed *
                0.8 +
                n.offset
            ) *
              0.6;

          n.mesh.position.z =
            n.basePos.z +
            Math.sin(
              t *
                n.speed *
                0.6 +
                n.offset
            ) *
              0.6;
        }
      );


      const posAttr =
        lineGeo.attributes
          .position;


      linePairs.forEach(
        (
          pair,
          index
        ) => {
          const a =
            nodes[
              pair[0]
            ].mesh.position;

          const b =
            nodes[
              pair[1]
            ].mesh.position;


          posAttr.array[
            index * 6
          ] = a.x;

          posAttr.array[
            index * 6 + 1
          ] = a.y;

          posAttr.array[
            index * 6 + 2
          ] = a.z;

          posAttr.array[
            index * 6 + 3
          ] = b.x;

          posAttr.array[
            index * 6 + 4
          ] = b.y;

          posAttr.array[
            index * 6 + 5
          ] = b.z;
        }
      );


      posAttr.needsUpdate =
        true;


      pulses.forEach(
        (p) => {
          p.t += p.speed;


          if (
            p.t > 1
          ) {
            p.t = 0;

            p.pair =
              linePairs[
                Math.floor(
                  Math.random() *
                    linePairs.length
                )
              ];
          }


          const a =
            nodes[
              p.pair[0]
            ].mesh.position;

          const b =
            nodes[
              p.pair[1]
            ].mesh.position;


          p.mesh.position.lerpVectors(
            a,
            b,
            p.t
          );


          p.mesh.material.opacity =
            Math.sin(
              p.t *
                Math.PI
            );
        }
      );


      nodeGroup.rotation.y =
        t * 0.02 +
        mouseX * 0.15;

      nodeGroup.rotation.x =
        mouseY * 0.1;

      lineSegments.rotation.copy(
        nodeGroup.rotation
      );

      dust.rotation.y =
        t * 0.008;


      camera.position.x +=
        (
          mouseX * 3 -
          camera.position.x
        ) *
        0.02;

      camera.position.y +=
        (
          -mouseY * 2 -
          camera.position.y
        ) *
        0.02;


      camera.lookAt(
        0,
        0,
        0
      );


      renderer.render(
        scene,
        camera
      );
    };


    animate();


    /* =====================================================
       RESIZE
    ===================================================== */

    const handleResize = () => {
      camera.aspect =
        window.innerWidth /
        window.innerHeight;

      camera.updateProjectionMatrix();

      renderer.setSize(
        window.innerWidth,
        window.innerHeight
      );
    };


    window.addEventListener(
      'resize',
      handleResize
    );


    /* =====================================================
       CLEANUP
    ===================================================== */

    return () => {
      cancelAnimationFrame(
        animationId
      );

      window.removeEventListener(
        'mousemove',
        handleMouseMove
      );

      window.removeEventListener(
        'resize',
        handleResize
      );


      if (
        holder.contains(
          renderer.domElement
        )
      ) {
        holder.removeChild(
          renderer.domElement
        );
      }


      renderer.dispose();

      nodeGeo.dispose();
      pulseGeo.dispose();
      lineGeo.dispose();
      dustGeo.dispose();

      lineMat.dispose();
      dustMat.dispose();
    };
  }, []);


  return (
    <div className="landing">

      {/* THREE.JS BACKGROUND */}

      <div
        ref={canvasHolderRef}
        className="canvas-holder"
      />

      <div className="veil" />


      <div className="landing-content">

        {/* =================================================
            NAVIGATION
        ================================================= */}

        <nav className="landing-nav">

          <div className="brand">

            <img
              src={logo}
              alt="Chatter-It logo"
              className="brand-mark"
            />

            <span>
              Chatter
              <span className="word-it">
                -It
              </span>
            </span>

          </div>


          <button
            className="nav-cta"
            onClick={onEnter}
          >
            Sign in
          </button>

        </nav>


        {/* =================================================
            HERO
            IMAGE LEFT
            TEXT RIGHT
        ================================================= */}

        <section className="hero">

          <div className="hero-layout">

            {/* LEFT — LANDING ILLUSTRATION */}

            <div className="hero-visual">

              <div className="visual-glow" />

              <img
                src={landingIllustration}
                alt="People communicating through Chatter-It"
                className="hero-illustration"
              />

            </div>


            {/* RIGHT — HERO TEXT */}

            <div className="hero-content">

              <div className="eyebrow">

                <span className="pulse-dot" />

                LIVE · REAL-TIME · ALWAYS ON

              </div>


              <h1>

                Every message,

                <br />

                <span className="grad">
                  the instant it's sent.
                </span>

              </h1>


              <p className="sub">

                Chatter-It moves at the
                speed of thought — messages
                land the moment they're
                typed, no refresh, no delay.
                Built on Socket.io for a
                connection that never sleeps.

              </p>


              <div className="hero-actions">

                <button
                  className="btn-primary"
                  onClick={onEnter}
                >
                  Enter Chatter-It →
                </button>


                <button
                  className="btn-ghost"
                  onClick={() =>
                    document
                      .querySelector(
                        '.demo-strip'
                      )
                      ?.scrollIntoView({
                        behavior:
                          'smooth',
                      })
                  }
                >
                  See it in action
                </button>

              </div>

            </div>

          </div>


          <div className="scroll-hint">

            <div className="stem" />

            scroll

          </div>

        </section>


        {/* =================================================
            ORIGINAL FEATURES SECTION
        ================================================= */}

        <section className="features">

          <div className="section-head">

            <span className="tag">
              Why it feels different
            </span>

            <h2>
              Built for conversation,
              not just messages
            </h2>

          </div>


          <div className="feature-grid">

            <div className="feature-card">

              <h3>
                Instant delivery
              </h3>

              <p>
                Every message broadcasts
                over a live socket connection
                — read by everyone in the room
                the moment it's sent.
              </p>

            </div>


            <div className="feature-card">

              <h3>
                Typing indicators
              </h3>

              <p>
                See exactly when someone's
                composing a reply, so
                conversations feel present
                instead of async.
              </p>

            </div>


            <div className="feature-card">

              <h3>
                Presence, always accurate
              </h3>

              <p>
                Online and offline status
                updates the instant a
                connection opens or drops —
                never a stale green dot.
              </p>

            </div>


            <div className="feature-card">

              <h3>
                History that persists
              </h3>

              <p>
                Messages are stored the
                moment they arrive, so
                refreshing the page never
                means losing the thread.
              </p>

            </div>


            <div className="feature-card">

              <h3>
                Read & delivered states
              </h3>

              <p>
                Know when a message has
                landed and when it's actually
                been seen — no guessing.
              </p>

            </div>


            <div className="feature-card">

              <h3>
                Resilient by design
              </h3>

              <p>
                Dropped connections reconnect
                gracefully, with clear errors
                instead of silent failure.
              </p>

            </div>

          </div>

        </section>


        {/* =================================================
            NEW SECTION
            ONE WORLD / GLOBAL CONVERSATIONS
        ================================================= */}

        <section className="world-section">

          {/* LEFT */}

          <div className="world-content">

            <h2>

              One world.

              <br />

              Many conversations.

            </h2>


            <div className="world-script">

              All in one place.

            </div>


            <div className="world-heart">
              ♥
            </div>

          </div>


          {/* RIGHT — IMGG2 */}

          <div className="world-image-wrap">

            <img
              src={globalConversations}
              alt="One world, many conversations"
              className="world-image"
            />

          </div>

        </section>


        {/* =================================================
            DEMO
        ================================================= */}

        <section className="demo-strip">

          <div className="section-head">

            <span className="tag">
              A conversation, live
            </span>

            <h2>
              This is what "instant"
              looks like
            </h2>

          </div>


          <div className="demo-window">

            <div className="demo-titlebar">

              <div className="dot" />

              <div className="dot" />

              <div className="dot" />

            </div>


            <div className="demo-body">

              <div
                className="bubble left"
                style={{
                  animationDelay:
                    '0.1s',
                }}
              >

                <b>
                  arjun_dev
                </b>{' '}
                
                <div className="bubble-message">
                hey! is the socket
                connection stable on
                your end?
                </div>

                <div className="bubble-time">
                  10:42 AM
                </div>
              </div>


              <div
                className="bubble right"
                style={{
                  animationDelay:
                    '0.9s',
                }}
              >
              
              <div className="bubble-message">
                yep! reconnected
                instantly after I closed
                my laptop lid 👀
              </div>

              <div className="bubble-meta">
              <span className="bubble-time">
                10:43 AM
              </span>
              <div className="bubble-status">
                <span>Read</span>
                <span className="info-icon">i</span>
              </div>
              </div>

              </div>


              <div
                className="bubble left"
                style={{
                  animationDelay:
                    '1.7s',
                }}
              >

                <b>arjun_dev</b>

                <div className="bubble-message">
                nice, testing the typing
                indicator now...
                </div>

                <div className="bubble-time">
                  10:44 AM
                </div>

              </div>


              <div
                className="typing-row"
                style={{
                  animationDelay:
                    '2.4s',
                }}
              >

                <span />
                <span />
                <span />

              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            FINAL HIGHLIGHT CARDS
        ================================================= */}

        <section className="final-highlights">

          <div className="highlight-card highlight-cyan">

            <div className="highlight-icon">
              💬
            </div>

            <div className="highlight-text">
              <h3>
                Real-time messaging
              </h3>
            </div>

          </div>


          <div className="highlight-card highlight-purple">

            <div className="highlight-icon">
              👥
            </div>

            <div className="highlight-text">
              <h3>
                Connect anywhere
              </h3>
            </div>

          </div>


          <div className="highlight-card highlight-lavender">

            <div className="highlight-icon">
              😊
            </div>

            <div className="highlight-text">
              <h3>
                Simple & friendly
              </h3>
            </div>

          </div>

        </section>


        {/* =================================================
            FOOTER
        ================================================= */}

        <footer>

          <span className="foot-brand">
            Chatter-It
          </span>

          <span className="foot-tag">
            Real-time chat · React ·
            Node · Socket.io
          </span>

        </footer>

      </div>

    </div>
  );
};

export default LandingPage;