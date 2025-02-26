const express = require("express");
const router = express.Router();
const User = require("./../models/user");
const Candidate = require("../models/candidate");
const { jwtAuthMiddleware, generateToken } = require("../jwt");

const checkAdminRole = async (userID) => {
  try {
    const user = await User.findById(userID);
    return user.role === "admin";
  } catch (error) {
    return false;
  }
};

//POST route to add a candidate
router.post("/", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id))) {
      return res.status(403).json({ message: "user does not have admin role" });
    }

    const data = req.body; //Assuming the request body contains the candidate data

    //Create a new candidate document using the Mongoose model
    const newCandidate = new Candidate(data);

    //Save the new candidate to database
    const response = await newCandidate.save();
    console.log("data saved");

    res.status(200).json({ response: response });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:candidateID", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id))) {
      return res.status(403).json({ message: "user does not have admin role" });
    }

    const candidateID = req.params.candidateID;
    const updatedCandidateData = req.body;

    const response = await Candidate.findByIdAndUpdate(
      candidateID,
      updatedCandidateData,
      {
        new: true, // Return the updated document
        runValidators: true, //Run mongoose validation
      }
    );

    if (!response) {
      return res.status(403).json({ error: "candidate not found" });
    }

    console.log("candidate data updated");
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Invalid server error" });
  }
});

router.delete("/:candidateID", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id))) {
      return res.status(403).json({ message: "user does not have admin role" });
    }

    const candidateID = req.params.candidateID;

    const response = await Candidate.findByIdAndDelete(candidateID);

    if (!response) {
      return res.status(404).json({ error: "candidate not found" });
    }

    console.log("candidate deleted");
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Invalid server error" });
  }
});

// Let's start voting
router.post("/vote/:candidateID", jwtAuthMiddleware, async (req, res) => {
  // no admin can vote
  // user can only vote once

  candidateID = req.params.candidateID;
  userId = req.user.id;

  try {
    // Find the candidate document with the specified candidateID
    const candidate = await Candidate.findById(candidateID);

    if (!candidate) {
      return res.status(403).json({ message: "candidate not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(403).json({ message: "user not found" });
    }

    if (user.isVoted) {
      return res.status(409).json({ message: "you have already voted" });
    }

    if (user.role === "admin") {
      return res.status(403).json({ message: "admin is not allowed" });
    }

    // Update the candidate document to record the vote
    candidate.votes.push({ user: userId });
    candidate.voteCount++;
    await candidate.save();

    // update the user document
    user.isVoted = true;
    await user.save();

    res.status(200).json({ message: "vote recorded successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// vote count
router.get("/vote/count", async (req, res) => {
  try {
    // Find all candidates and sort them by voteCount in descending order
    const candidate = await Candidate.find().sort({ voteCount: "desc" });

    // Map the candidates to only return name and voteCount
    const voteRecord = candidate.map((data) => {
      return {
        party: data.party,
        count: data.voteCount,
      };
    });

    return res.status(200).json(voteRecord);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get List of all candidates with only name and party fields
router.get("/", async (req, res) => {
  try {
    // Find all candidates and select only the name and party fields, excluding _id
    const candidates = await Candidate.find({}, "name party -_id");

    // Return the list of candidates
    res.status(200).json(candidates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
