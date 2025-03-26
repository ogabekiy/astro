"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"
import { useRef, useState, useEffect } from "react"
import * as THREE from "three"
import { Send } from "lucide-react"

const isMobile = () => {
  if (typeof window === "undefined") return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

const BackgroundMusic = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)

  useEffect(() => {
    audioRef.current = new Audio("/STARGAZING.mp3")
    audioRef.current.loop = true
    audioRef.current.volume = 0.5

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [])

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch((err) => console.error("Error playing audio:", err))
      }
    }
  }

  return (
    <div className="fixed left-1/2 bottom-6 transform -translate-x-1/2 z-50">
      <button
        onClick={toggleMusic}
        className="bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center"
      >
        <span className="text-2xl mr-2">{isPlaying}</span>
        <span className="font-2xl font-bold">{isPlaying ? "playing" : "play"}</span>
      </button>
    </div>
  )
}

const BoxWithEdges = ({ position }) => {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshPhysicalMaterial
          color="#0070f3"
          roughness={0.1}
          metalness={0.8}
          transparent={true}
          opacity={0.9}
          transmission={0.5}
          clearcoat={1}
        />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(0.5, 0.5, 0.5)]} />
        <lineBasicMaterial color="#214dbd" linewidth={2} />
      </lineSegments>
    </group>
  )
}

const BoxLetter = ({ letter, position }) => {
  const group = useRef()

  const getLetterShape = (letter) => {
    const shapes = {
      N: [
        [1, 0, 0, 0, 1],
        [1, 1, 0, 0, 1],
        [1, 0, 1, 0, 1],
        [1, 0, 0, 1, 1],
        [1, 0, 0, 0, 1],
      ],
      E: [
        [1, 1, 1],
        [1, 0, 0],
        [1, 1, 0],
        [1, 0, 0],
        [1, 1, 1],
      ],
      X: [
        [1, 0, 0, 0, 1],
        [0, 1, 0, 1, 0],
        [0, 0, 1, 0, 0],
        [0, 1, 0, 1, 0],
        [1, 0, 0, 0, 1],
      ],
      T: [
        [1, 1, 1],
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
      ],
      A: [
        [0, 1, 1, 0],
        [1, 0, 0, 1],
        [1, 1, 1, 1],
        [1, 0, 0, 1],
        [1, 0, 0, 1],
      ],
      S: [
        [0, 1, 1, 0],
        [0, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 1, 0],
        [0, 1, 1, 0],
      ],
      R: [
        [1, 1, 0, 0],
        [1, 0, 1, 0],
        [1, 1, 1, 0],
        [1, 0, 1, 0],
        [1, 0, 1, 0],
      ],
      O: [
        [0, 1, 1, 0],
        [1, 0, 0, 1],
        [1, 0, 0, 1],
        [1, 0, 0, 1],
        [0, 1, 1, 0],
      ],
      O2: [
        [0, 1, 1, 0],
        [1, 0, 0, 1],
        [1, 0, 0, 1],
        [1, 0, 0, 1],
        [0, 1, 1, 0],
      ],
      W: [
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 1, 0, 1],
        [1, 1, 0, 1, 1],
        [1, 0, 0, 0, 1],
      ],
      L: [
        [1, 0, 0],
        [1, 0, 0],
        [1, 0, 0],
        [1, 0, 0],
        [1, 1, 1],
      ],
      D: [
        [1, 1, 0],
        [1, 0, 1],
        [1, 0, 1],
        [1, 0, 1],
        [1, 1, 0],
      ],
    }
    return shapes[letter] || shapes["N"]
  }

  const letterShape = getLetterShape(letter)

  return (
    <group ref={group} position={position}>
      {letterShape.map((row, i) =>
        row.map((cell, j) => {
          if (cell) {
            let xOffset =
              j * 0.5 - (letter === "T" ? 1 : letter === "E" ? 0.5 : letter === "X" || letter === "N" ? 1 : 0.75)

            if (letter === "N") {
              if (j === 0) {
                xOffset = -0.5
              } else if (j === 1) {
                xOffset = 0
              } else if (j === 2) {
                xOffset = 0.25
              } else if (j === 3) {
                xOffset = 0.5
              } else if (j === 4) {
                xOffset = 1
              }
            }

            if (letter === "X") {
              if (j === 0) {
                xOffset = -1
              } else if (j === 1) {
                xOffset = -0.75
              } else if (j === 2) {
                xOffset = -0.25
              } else if (j === 3) {
                xOffset = 0.25
              } else if (j === 4) {
                xOffset = 0.5
              }
            }

            return <BoxWithEdges key={`${i}-${j}`} position={[xOffset, (4 - i) * 0.5 - 1, 0]} />
          }
          return null
        }),
      )}
    </group>
  )
}

const Scene = () => {
  const orbitControlsRef = useRef()
  const [isMobileDevice, setIsMobileDevice] = useState(false)

  useEffect(() => {
    setIsMobileDevice(isMobile())
  }, [])

  return (
    <>
      <group position={[-0.5, 0, 0]} rotation={[0, Math.PI / 1.5, 0]}>
        <BoxLetter letter="A" position={[-9, 0, 0]} />
        <BoxLetter letter="S" position={[-7, 0, 0]} />
        <BoxLetter letter="T" position={[-5, 0, 0]} />
        <BoxLetter letter="R" position={[-3, 0, 0]} />
        <BoxLetter letter="O" position={[-1, 0, 0]} />
        <BoxLetter letter="W" position={[2, 0, 0]} />
        <BoxLetter letter="O" position={[5, 0, 0]} />
        <BoxLetter letter="R" position={[8, 0, 0]} />
        <BoxLetter letter="L" position={[10.5, 0, 0]} />
        <BoxLetter letter="D" position={[13, 0, 0]} />
      </group>
      <OrbitControls
        ref={orbitControlsRef}
        enableZoom
        enablePan
        enableRotate
        autoRotate
        autoRotateSpeed={2}
        rotation={[Math.PI, 0, 0]}
      />

      <ambientLight intensity={0.5} />

      <directionalLight position={[5, 5, 5]} intensity={0.5} color="#ffffff" />

      <Environment
        files={
          isMobileDevice
            ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/download3-7FArHVIJTFszlXm2045mQDPzsZqAyo.jpg"
            : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dither_it_M3_Drone_Shot_equirectangular-jpg_San_Francisco_Big_City_1287677938_12251179%20(1)-NY2qcmpjkyG6rDp1cPGIdX0bHk3hMR.jpg"
        }
        background
      />
    </>
  )
}

// Telegram button component
const TelegramButton = () => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <a
      href="https://t.me/cosmo_music_vibe"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center p-4 rounded-full bg-[#0088cc] hover:bg-[#0099dd] transition-all duration-300 shadow-lg group"
      style={{
        transform: isHovered ? "scale(1.1)" : "scale(1)",
        boxShadow: isHovered ? "0 0 20px rgba(0, 136, 204, 0.8)" : "0 4px 12px rgba(0, 0, 0, 0.3)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Send className="w-6 h-6 text-white" style={{ transform: "rotate(45deg)" }} />
      <span className="absolute right-full mr-3 bg-black bg-opacity-80 text-white text-sm py-1 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        @cosmo_music_vibe
      </span>
    </a>
  )
}

export default function Component() {
  return (
    <div className="w-full h-screen bg-gray-900">
      <Canvas camera={{ position: [15, 0, -15], fov: 50 }}>
        <Scene />
      </Canvas>
      <TelegramButton />
      <BackgroundMusic />
    </div>
  )
}

