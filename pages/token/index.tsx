import { Flex, Text } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import Token from "../../components/Token"
const Merchant = () => {
  return (
    <Flex
      alignContent="center"
      justifyContent="center"
      width="100%"
      backgroundColor="gray.800"
      height="100vh"
    >
      <Token />
    </Flex>
  )
}

export default Merchant
