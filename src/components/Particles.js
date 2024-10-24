import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Particles({ count = 5000 }) {
  const mesh = useRef()
  const light = useRef()

  const particles = useMemo(() => {
    const temp = new THREE.Vector3()
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 20
      const y = (Math.random() - 0.5) * 20
      const z = (Math.random() - 0.5) * 20
      positions.set([x, y, z], i * 3)
    }
    return new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(positions, 3))
  }, [count])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    mesh.current.rotation.x = Math.sin(time / 10)
    mesh.current.rotation.y = Math.sin(time / 15)
    light.current.position.x = Math.sin(time) * 3
    light.current.position.y = Math.cos(time) * 3
  })

  return (
    <group>
      <points ref={mesh} geometry={particles}>
        <pointsMaterial size={0.05} color="#ffffff" sizeAttenuation transparent />
      </points>
      <pointLight ref={light} distance={10} intensity={2} color="lightblue" />
    </group>
  )
}

export default Particles