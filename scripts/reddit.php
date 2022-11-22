<?php

$json = file_get_contents("https://www.reddit.com/r/Stadia/comments/ezzjji/google_has_a_history_of_starting_from_behind_and.json");

foreach($json as $post)
print_r(json_decode($json));
