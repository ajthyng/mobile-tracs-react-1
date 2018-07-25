import React, {Component} from 'react'
import styled from 'styled-components'

const Container = styled.View`
  width: 100%;
  margin: 10px;
  bottom: 0;
`

const UPPSContent = styled.Text`
  text-align: center;
  font-size: 10px;
`

const uppsText = `Use of computer and network facilities owned or operated by Texas State University requires prior authorization. Unauthorized access is prohibited. Usage may be subject to security testing and monitoring, and affords no privacy guarantees or expectations except as otherwise provided by applicable privacy laws. Abuse is subject to criminal prosecution. Use of these facilities implies agreement to comply with the policies of Texas State University.`

const UPPSText = () => {
  return (
    <Container>
      <UPPSContent>
        {uppsText}
      </UPPSContent>
    </Container>
  )
}

export default UPPSText