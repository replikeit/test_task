
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./Ownable.sol";

/**
 * @dev A contract that implements the logic of the pause. 
 *
 * This module is used through inheritance. It will make available the modifier
 * `checkPause`
 */

contract Pausable is Ownable{
    
    // if true - methods on pause
    bool private _is_pause;

    constructor(){
        _is_pause = false;
    }


    /**
     * @dev Returns true if methods on pause.
     */
    function isPause() public view returns (bool){
        return _is_pause;
    }

    /**
     * @dev Pause methods.
     */
    function pause() external onlyOwner {
        _is_pause = true;
    }

    /**
     * @dev Unpause methods.
     */
    function unpause() external onlyOwner{
        _is_pause = false;
    }

    
    /**
     * @dev Revert if method was call when `_is_pause` is true.
     */
    modifier checkPause() {
        require(!isPause(), "Pausable: method on pause");
        _;
    }
}
