import { Flex, Text } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import Collection from "../../components/Collection"
const Merchant = () => {
  return (
    <Flex
      alignContent="center"
      justifyContent="center"
      width="100%"
      backgroundColor="gray.800"
      height="100vh"
    >
      <Collection />
    </Flex>
  )
}

export default Merchant
