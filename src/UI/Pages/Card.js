import React, { Component } from "react";
import { AiOutlineClockCircle } from "react-icons/ai";

class Card extends Component {
  render() {
    const { title, subtitle } = this.props;

    return (
      <div className="bg-white p-4 shadow-md rounded-lg">
        <h2 className=" text-base font-bold">{title}</h2>
        <p className="flex items-center mt-2 font-extralight text-sm">
          <i className="mr-2"><AiOutlineClockCircle/></i>
          {subtitle}
        </p>
      </div>
    );
  }
}

export default Card;
