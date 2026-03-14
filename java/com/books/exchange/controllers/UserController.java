package com.books.exchange.controllers;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.books.exchange.payloads.Apiresponse;
import com.books.exchange.payloads.UserDto;
import com.books.exchange.services.UserService;


@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
	private UserService userService;
	
	//PUT - update user
	
	@PutMapping("/{userId}")
	public ResponseEntity<UserDto> updateUser(@Valid @RequestBody UserDto userDto,@PathVariable("userId") int uid)
	{
		UserDto updatedUser = this.userService.updateUser(userDto, uid);
		return ResponseEntity.ok(updatedUser);
		
		
		
	}
	@DeleteMapping("/{userId}")
	public ResponseEntity<Apiresponse> deleteuser(@PathVariable("userId") int uid)
	{
		this.userService.deleteUser(uid);
		return new ResponseEntity<Apiresponse>(new Apiresponse("User deleted Succesfully", true), HttpStatus.OK);
	}
	
	@GetMapping("/")
    public ResponseEntity<List<UserDto>> getAllUsers()
    {
		return ResponseEntity.ok(this.userService.getAllUsers());
    }
	 
	@GetMapping("/{userId}")
	 public ResponseEntity<UserDto> getSingleUser(@PathVariable int userId)
	    {
			return ResponseEntity.ok(this.userService.getUserById(userId));
	    }
	
	
	//DELETE - delete user
	//GET - user get
}
