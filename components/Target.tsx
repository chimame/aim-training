import React, { useState } from 'react'
import { Group, Circle, Text } from 'react-konva'
import Animate from 'react-move/Animate'
import { easeExpOut as ease } from 'd3-ease'

import Sound from 'react-sound'

export type HitResult = {
  point: number,
}

function pointColor(point) {
  return point >= 50 ? 'red' : 'black'
}

type Props = {
  x: number,
  y: number,
  r?: number,
  enable?: boolean,
  colIn?: string,
  colOu?: string,
  handleHit?: (hitResult: HitResult) => void,
}

const Target = (props: Props) => {
  const defaultProps = {
    r: 25,
    enable: true,
    colIn: '#FDA831',
    colOu: '#DE561C',
    handleHit: () => {},
  }
  props = { ...defaultProps, ...props }

  const defaultState = {
    play: false,
    hit: false,
    point: 0,
    counter: 0,
  }

  const [state, setState] = useState(defaultState)

  const handleClick = (e: { evt: { x: number, y: number } }) => {
    if (!props.enable) {
      return
    }
    const dx = props.x - e.evt.x
    const dy = props.y - e.evt.y
    const d = Math.sqrt(dx * dx + dy * dy)
    const rate = d / props.r
    const point = (10 - Math.floor(rate * 10)) * 10
    if (point <= 0) {
      return
    }
    setState({
      point,
      play: true,
      hit: true,
      counter: state.counter + 1,
    })
    props.handleHit({ point })
  }

  const { x, y, r } = props
  return (
    <Group>
      <Animate
        start={() => ({
          dy: -r * 1.5,
        })}
        update={() => {
          if (state.hit) {
            setState({ ...state, hit: false })
            return {
              dy: [0, -r * 1.5],
              timing: { duration: 500, ease },
            }
          }
          return {}
        }}
      >
        {s => {
          return (
            <Text
              x={x - r}
              y={y - r + s.dy}
              width={r * 2}
              align={'center'}
              fontSize={r}
              fill={pointColor(state.point)}
              text={state.point.toString()}
            />
          )
        }}
      </Animate>
      <Circle
        x={x}
        y={y}
        radius={r}
        fill={props.enable ? props.colIn : '#aaa'}
        onClick={handleClick}
      />
      <Circle
        x={x}
        y={y}
        radius={r / 2}
        fill={props.enable ? props.colOu : '#333'}
        onClick={handleClick}
      />
      <Sound
        url="bomb.wav"
        autoLoad={true}
        playStatus={state.play ? Sound.status.PLAYING : Sound.status.STOPPED}
        onPlaying={() => {}}
        onFinishedPlaying={() => {
          setState({...state, play: false })
        }}
      />
    </Group>
  )
}

export default Target