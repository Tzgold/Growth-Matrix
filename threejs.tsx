import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const data = [2, 4, 3, 6, 1]

const ThreeDBarChart = () => {
  const mountRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // === Scene & Camera ===
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x1e1e1e) // dark background for cool vibe
    const camera = new THREE.PerspectiveCamera(75, 600 / 400, 0.1, 1000)
    camera.position.set(4, 6, 10)

    // === Renderer ===
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(600, 400)
    mountRef.current?.appendChild(renderer.domElement)

    // === Controls (optional, drag/zoom) ===
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true

    // === Lighting ===
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(5, 10, 7)
    scene.add(directionalLight)

    // === Bars ===
    const bars: THREE.Mesh[] = []
    data.forEach((value, i) => {
      const geometry = new THREE.BoxGeometry(0.8, value, 0.8)
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(`hsl(${(i / data.length) * 360}, 80%, 50%)`),
        metalness: 0.6,
        roughness: 0.3,
      })
      const bar = new THREE.Mesh(geometry, material)

      bar.position.x = i * 1.2 - ((data.length - 1) * 1.2) / 2 // center
      bar.position.y = value / 2
      bar.position.z = 0

      scene.add(bar)
      bars.push(bar)
    })

    // === Floor Grid (optional) ===
    const gridHelper = new THREE.GridHelper(10, 10)
    scene.add(gridHelper)

    // === Animate ===
    const animate = () => {
      requestAnimationFrame(animate)

      // Rotate entire chart for 3D vibe
      scene.rotation.y += 0.005

      // Slight bar bounce effect
      bars.forEach((bar, idx) => {
        bar.scale.y = data[idx] * (0.8 + 0.2 * Math.sin(Date.now() * 0.002 + idx))
        bar.position.y = (bar.scale.y * 1) / 2
      })

      controls.update()
      renderer.render(scene, camera)
    }

    animate()

    // === Cleanup on unmount ===
    return () => {
      mountRef.current?.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [])

  return <div ref={mountRef}></div>
}

// i almost just forgot it ohhh
// yeah so lets make it happen though
// for the fourth time


export default ThreeDBarChart
